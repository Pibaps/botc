import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const command = process.platform === "win32" ? "npx next build" : "npx";
const assetsRoot = path.join(repoRoot, "public", "assets", "botc");
const backupRoot = path.join(repoRoot, ".botc-mobile-assets-backup");

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkFiles(entryPath)));
    } else {
      results.push(entryPath);
    }
  }

  return results;
}

async function collectReferencedAssets() {
  const srcRoot = path.join(repoRoot, "src");
  const files = await walkFiles(srcRoot);
  const referenced = new Set();
  const assetPattern = /\/assets\/botc\/[A-Za-z0-9._\-\/]+/g;

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    if (![".ts", ".tsx", ".js", ".jsx", ".css", ".md"].includes(ext)) {
      continue;
    }

    const text = await fs.readFile(filePath, "utf8");
    const matches = text.match(assetPattern);
    if (!matches) continue;

    for (const match of matches) {
      const clean = match.replace(/["'`),;\s]+$/g, "");
      referenced.add(clean);
    }
  }

  if (await exists(path.join(assetsRoot, "manifest.json"))) {
    referenced.add("/assets/botc/manifest.json");
  }

  return referenced;
}

async function copyPrunedAssets(referencedAssets) {
  if (await exists(backupRoot)) {
    await fs.rm(backupRoot, { recursive: true, force: true });
  }

  await fs.rename(assetsRoot, backupRoot);
  await fs.mkdir(assetsRoot, { recursive: true });

  const copied = [];
  for (const assetPath of referencedAssets) {
    const relativePath = assetPath.replace(/^\/assets\/botc\//u, "");
    const sourcePath = path.join(backupRoot, relativePath);
    const targetPath = path.join(assetsRoot, relativePath);

    if (!(await exists(sourcePath))) {
      continue;
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
    copied.push(relativePath);
  }

  return copied;
}

async function restoreAssets() {
  if (await exists(assetsRoot)) {
    await fs.rm(assetsRoot, { recursive: true, force: true });
  }

  if (await exists(backupRoot)) {
    await fs.rename(backupRoot, assetsRoot);
  }
}

async function main() {
  const referencedAssets = await collectReferencedAssets();
  const copied = await copyPrunedAssets(referencedAssets);

  console.log(`Mobile build asset prune: kept ${copied.length} files`);

  let exitCode = 1;
  try {
    const result = spawnSync(command, process.platform === "win32" ? [] : ["next", "build"], {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: {
        ...process.env,
        BOTC_MOBILE_EXPORT: "1",
      },
    });

    exitCode = result.status ?? 1;
    console.log(`Mobile build exit code: ${exitCode}`);
  } finally {
    await restoreAssets();
  }

  process.exit(exitCode);
}

main().catch(async (error) => {
  console.error(error);
  try {
    await restoreAssets();
  } catch {
    // Ignore restore failures here; the original tree may already be intact.
  }
  process.exit(1);
});