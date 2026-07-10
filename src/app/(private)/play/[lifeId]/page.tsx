"use client";

import { use } from "react";

import { PlayScreen } from "@/widgets/play/ui/PlayScreen";

export default function PlayPage({ params }: { params: Promise<{ lifeId: string }> }) {
  const { lifeId } = use(params);
  return <PlayScreen lifeId={lifeId} />;
}
