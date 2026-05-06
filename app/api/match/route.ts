import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { runMatching } from "@/lib/matching";
import type { Senior, Job } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { senior_id } = (await req.json()) as { senior_id: string };

  // RPC 우선 시도
  const { data: rpcResult, error: rpcError } = await supabase.rpc("match_senior", {
    p_senior_id: senior_id,
  });

  if (!rpcError) {
    return NextResponse.json({ matched: rpcResult, method: "rpc" });
  }

  // 폴백: 앱 레이어 계산
  const { data: senior } = await supabase
    .from("seniors")
    .select("*")
    .eq("id", senior_id)
    .single<Senior>();

  if (!senior) {
    return NextResponse.json({ error: "Senior not found" }, { status: 404 });
  }

  const { data: jobs } = await supabase.from("jobs").select("*").returns<Job[]>();

  const scores = runMatching(senior, jobs ?? []);

  if (scores.length > 0) {
    await supabase.from("matches").upsert(
      scores.map((s) => ({ ...s, status: "pending" })),
      { onConflict: "senior_id,job_id", ignoreDuplicates: false }
    );
  }

  return NextResponse.json({ matched: scores.length, method: "app_layer" });
}
