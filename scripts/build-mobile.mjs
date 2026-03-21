import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "npx.cmd" : "npx";

const result = spawnSync(command, ["next", "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    BOTC_MOBILE_EXPORT: "1",
  },
});

process.exit(result.status ?? 1);