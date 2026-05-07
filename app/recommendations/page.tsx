export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MatchRow = {
  id: string;
  score: number;
  status: string;
  seniors: { name: string } | null;
  jobs: {
    title: string;
    region: string;
    job_type: string;
    required_career: number;
  } | null;
};

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score === 6
      ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-400"
      : score >= 4
      ? "bg-green-600 text-white hover:bg-green-600"
      : "bg-gray-500 text-white hover:bg-gray-500";
  return (
    <Badge className={`shrink-0 text-lg px-4 py-2 ${cls}`}>{score}점</Badge>
  );
}

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ senior_id?: string }>;
}) {
  const { senior_id } = await searchParams;

  if (!senior_id) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">맞춤 일자리 추천</h1>
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 py-16 text-center space-y-6">
          <p className="text-2xl font-semibold text-amber-800">
            프로필을 먼저 등록해 주세요
          </p>
          <a
            href="/register"
            className={cn(buttonVariants({ size: "lg" }), "text-xl py-6 px-10")}
          >
            프로필 등록하기
          </a>
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from("matches")
    .select(
      "id, score, status, seniors(name), jobs(title, region, job_type, required_career)"
    )
    .eq("senior_id", senior_id)
    .order("score", { ascending: false });

  const matches = (data ?? []) as unknown as MatchRow[];
  const seniorName = matches[0]?.seniors?.name ?? "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">맞춤 일자리 추천</h1>
        <p className="mt-2 text-xl text-gray-600">
          {seniorName
            ? `${seniorName} 님의 추천 결과 · 점수 높은 순`
            : "추천 결과 · 점수 높은 순"}
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 py-16 text-center space-y-2">
          <p className="text-2xl font-semibold text-amber-800">
            현재 매칭되는 일자리가 없습니다
          </p>
          <p className="text-lg text-amber-700">
            담당자가 새 일자리를 등록하면 자동으로 매칭됩니다
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => (
            <Card key={m.id} className="border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-2xl">
                    {m.jobs?.title ?? "—"}
                  </CardTitle>
                  <ScoreBadge score={m.score} />
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4 text-xl">
                <p>직종: {m.jobs?.job_type ?? "—"}</p>
                <p>지역: {m.jobs?.region ?? "—"}</p>
                <p>필요 경력: {m.jobs?.required_career ?? 0}년 이상</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
