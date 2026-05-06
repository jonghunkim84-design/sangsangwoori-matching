"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ConfirmButton({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await fetch(`/api/match/${matchId}`, { method: "PATCH" });
    router.refresh();
    setLoading(false);
  }

  return (
    <Button
      size="sm"
      onClick={handleConfirm}
      disabled={loading}
      className="text-base px-4 py-2 shrink-0"
    >
      {loading ? "처리 중..." : "배정 확정"}
    </Button>
  );
}
