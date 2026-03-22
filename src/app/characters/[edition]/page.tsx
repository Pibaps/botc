import { notFound } from "next/navigation";
import { charactersByEdition, editionMeta, type Edition } from "@/data/characters";
import EditionClient from "./EditionClient";

export function generateStaticParams() {
  return [
    { edition: "trouble-brewing" },
    { edition: "bad-moon-rising" },
    { edition: "sects-and-violets" },
    { edition: "experimental" },
  ];
}

export const dynamicParams = false;

export default async function EditionPage({
  params,
}: {
  params: Promise<{ edition: string }> | { edition: string };
}) {
  const { edition } = await params;
  const editionId = edition as Edition;
  const ed = editionMeta[editionId];

  if (!ed) notFound();

  const chars = charactersByEdition[editionId] ?? [];

  return <EditionClient editionId={editionId} charCount={chars.length} />;
}