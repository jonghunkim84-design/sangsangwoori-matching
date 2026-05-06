import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { runMatching } from "@/lib/matching";
import type { Senior, Job } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { senior_id } = (await req.json()) as { senior_id: string };

  const { data: senior } = await supabase
    .from("seniors")
    .select("*")
    .eq("id", senior_id)
    .single<Senior>();

  if (!senior) {
    return NextResponse.json({ error: "Senior not found" }, { status: 404 });
  }

  const { data: jobs } = await supabase.from("jobs").select("*").returns<Job[]>();

  // 기존 매칭 삭제 후 재계산
  await supabase.from("matches").delete().eq("senior_id", senior_id);

  const scores = runMatching(senior, jobs ?? []);

  if (scores.length > 0) {
    await supabase
      .from("matches")
      .insert(scores.map((s) => ({ ...s, status: "pending" })));
  }

  return NextResponse.json({ matched: scores.length });
}
