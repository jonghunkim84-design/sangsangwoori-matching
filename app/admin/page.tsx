import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JobManager from "./JobManager";

type SeniorRow = {
  id: string;
  name: string;
  region: string;
  desired_job: string;
  career_years: number;
};

type MatchRow = {
  id: string;
  senior_id: string;
  score: number;
  status: string;
};

function seniorStatus(matches: MatchRow[]): "미매칭" | "매칭대기" | "배정완료" {
  if (matches.length === 0) return "미매칭";
  if (matches.some((m) => m.status === "assigned" || m.status === "done"))
    return "배정완료";
  return "매칭대기";
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score === 6
      ? "bg-yellow-400 text-yellow-900"
      : score >= 4
      ? "bg-green-600 text-white"
      : "bg-gray-400 text-white";
  return (
    <Badge className={`text-base px-3 py-1 ${cls}`}>{score}점</Badge>
  );
}

export default async function AdminPage() {
  const [{ data: rawSeniors }, { data: rawMatches }] = await Promise.all([
    supabase
      .from("seniors")
      .select("id, name, region, desired_job, career_years")
      .order("created_at", { ascending: false }),
    supabase.from("matches").select("id, senior_id, score, status"),
  ]);

  const seniors = (rawSeniors ?? []) as SeniorRow[];
  const allMatches = (rawMatches ?? []) as MatchRow[];

  const matchesBySenior = new Map<string, MatchRow[]>();
  for (const m of allMatches) {
    if (!matchesBySenior.has(m.senior_id))
      matchesBySenior.set(m.senior_id, []);
    matchesBySenior.get(m.senior_id)!.push(m);
  }

  const seniorData = seniors.map((s) => {
    const matches = matchesBySenior.get(s.id) ?? [];
    const status = seniorStatus(matches);
    const bestScore =
      matches.length > 0 ? Math.max(...matches.map((m) => m.score)) : null;
    return { ...s, status, bestScore };
  });

  const unmatched = seniorData.filter((s) => s.status === "미매칭");
  const pending = seniorData.filter((s) => s.status === "매칭대기");
  const assigned = seniorData.filter((s) => s.status === "배정완료");

  const summary = [
    {
      label: "미매칭",
      count: unmatched.length,
      color: "bg-red-50 border-red-200",
      text: "text-red-700",
    },
    {
      label: "매칭 대기",
      count: pending.length,
      color: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-700",
    },
    {
      label: "배정 완료",
      count: assigned.length,
      color: "bg-green-50 border-green-200",
      text: "text-green-700",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">담당자 대시보드</h1>
        <p className="mt-2 text-xl text-gray-600">
          매칭 현황을 한눈에 확인하고 배정을 관리하세요
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-6">
        {summary.map((s) => (
          <Card key={s.label} className={`border-2 ${s.color}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-5xl font-bold ${s.text}`}>{s.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 시니어 목록 */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">시니어 목록</h2>
        {seniors.length === 0 ? (
          <p className="text-lg text-gray-400 py-4">
            등록된 시니어가 없습니다.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
            <table className="w-full text-lg">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">이름</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">지역</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">희망 직종</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">최고 점수</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">상태</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {seniorData.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 font-medium">{s.name}</td>
                    <td className="px-4 py-4">{s.region}</td>
                    <td className="px-4 py-4">{s.desired_job}</td>
                    <td className="px-4 py-4">
                      {s.bestScore !== null ? (
                        <ScoreBadge score={s.bestScore} />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={
                          s.status === "배정완료"
                            ? "text-green-700 font-semibold"
                            : s.status === "매칭대기"
                            ? "text-yellow-700 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <a
                        href={`/recommendations?senior_id=${s.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        상세보기
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 일자리 관리 */}
      <div className="border-t-2 border-gray-200 pt-10">
        <JobManager />
      </div>
    </div>
  );
}
