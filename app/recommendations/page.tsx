import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

function scoreBadgeClass(score: number) {
  if (score >= 80) return "bg-green-600 hover:bg-green-600";
  if (score >= 40) return "bg-blue-600 hover:bg-blue-600";
  return "bg-gray-500 hover:bg-gray-500";
}

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ senior_id?: string }>;
}) {
  const { senior_id } = await searchParams;

  let query = supabase
    .from("matches")
    .select(
      "id, score, status, seniors(name), jobs(title, region, job_type, required_career)"
    )
    .order("score", { ascending: false });

  if (senior_id) query = query.eq("senior_id", senior_id);

  const { data } = await query;
  const matches = (data ?? []) as unknown as MatchRow[];

  const seniorName = senior_id && matches[0]?.seniors?.name
    ? matches[0].seniors.name
    : "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">맞춤 일자리 추천</h1>
        <p className="mt-2 text-xl text-gray-600">
          {seniorName
            ? `${seniorName} 님의 추천 결과 · 점수 높은 순`
            : "전체 매칭 결과 · 점수 높은 순"}
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 py-20 text-center">
          <p className="text-2xl text-gray-400">매칭 결과가 없습니다</p>
          <p className="mt-2 text-lg text-gray-400">
            프로필을 등록하면 이 자리에 추천 결과가 표시됩니다
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => (
            <Card key={m.id} className="border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">
                      {m.jobs?.title ?? "—"}
                    </CardTitle>
                    {!senior_id && (
                      <p className="mt-1 text-lg text-gray-500">
                        시니어: {m.seniors?.name ?? "—"}
                      </p>
                    )}
                  </div>
                  <Badge
                    className={`shrink-0 text-lg px-4 py-2 text-white ${scoreBadgeClass(m.score)}`}
                  >
                    {m.score}점
                  </Badge>
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
