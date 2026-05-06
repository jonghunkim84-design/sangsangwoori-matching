import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConfirmButton from "./ConfirmButton";

type SeniorRow = {
  id: string;
  name: string;
  region: string;
  desired_job: string;
  career_years: number;
};

type MatchRow = {
  id: string;
  score: number;
  status: string;
  seniors: SeniorRow | null;
  jobs: {
    title: string;
    region: string;
    job_type: string;
    required_career: number;
  } | null;
};

export default async function AdminPage() {
  const [{ data: rawSeniors }, { data: rawMatches }] = await Promise.all([
    supabase.from("seniors").select("id, name, region, desired_job, career_years"),
    supabase
      .from("matches")
      .select(
        "id, score, status, seniors(id, name, region, desired_job, career_years), jobs(title, region, job_type, required_career)"
      )
      .order("score", { ascending: false }),
  ]);

  const seniors = (rawSeniors ?? []) as SeniorRow[];
  const matches = (rawMatches ?? []) as unknown as MatchRow[];

  const matchedIds = new Set(matches.map((m) => m.seniors?.id).filter(Boolean));
  const unmatched = seniors.filter((s) => !matchedIds.has(s.id));
  const pending   = matches.filter((m) => m.status === "pending");
  const confirmed = matches.filter((m) => m.status === "confirmed");

  const summary = [
    { label: "미매칭",  count: unmatched.length, color: "bg-red-50 border-red-200",    text: "text-red-700"   },
    { label: "매칭 대기", count: pending.length,  color: "bg-yellow-50 border-yellow-200", text: "text-yellow-700" },
    { label: "배정 완료", count: confirmed.length, color: "bg-green-50 border-green-200", text: "text-green-700"  },
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

      {/* 미매칭 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">미매칭</h2>
          <Badge className="bg-red-100 text-red-800 text-base px-3 py-1">
            {unmatched.length}명
          </Badge>
        </div>
        {unmatched.length === 0 ? (
          <p className="text-lg text-gray-400 py-2">해당 없음</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {unmatched.map((s) => (
              <Card key={s.id} className="border-2 border-red-100">
                <CardContent className="pt-5 space-y-1">
                  <p className="text-xl font-semibold">{s.name}</p>
                  <p className="text-lg text-gray-600">지역: {s.region}</p>
                  <p className="text-lg text-gray-600">희망 직종: {s.desired_job}</p>
                  <p className="text-lg text-gray-600">경력: {s.career_years}년</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 매칭 대기 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">매칭 대기</h2>
          <Badge className="bg-yellow-100 text-yellow-800 text-base px-3 py-1">
            {pending.length}건
          </Badge>
        </div>
        {pending.length === 0 ? (
          <p className="text-lg text-gray-400 py-2">해당 없음</p>
        ) : (
          <div className="space-y-4">
            {pending.map((m) => (
              <Card key={m.id} className="border-2 border-yellow-200">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{m.jobs?.title ?? "—"}</CardTitle>
                      <p className="mt-1 text-lg text-gray-500">
                        시니어: {m.seniors?.name ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="text-base px-3 py-1 bg-blue-600 text-white">
                        {m.score}점
                      </Badge>
                      <ConfirmButton matchId={m.id} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 text-lg">
                  <p>직종: {m.jobs?.job_type ?? "—"}</p>
                  <p>지역: {m.jobs?.region ?? "—"}</p>
                  <p>필요 경력: {m.jobs?.required_career ?? 0}년 이상</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 배정 완료 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">배정 완료</h2>
          <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
            {confirmed.length}건
          </Badge>
        </div>
        {confirmed.length === 0 ? (
          <p className="text-lg text-gray-400 py-2">해당 없음</p>
        ) : (
          <div className="space-y-4">
            {confirmed.map((m) => (
              <Card key={m.id} className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{m.jobs?.title ?? "—"}</CardTitle>
                      <p className="mt-1 text-lg text-gray-500">
                        시니어: {m.seniors?.name ?? "—"}
                      </p>
                    </div>
                    <Badge className="text-base px-3 py-1 bg-green-600 text-white">
                      {m.score}점 · 확정
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 text-lg">
                  <p>직종: {m.jobs?.job_type ?? "—"}</p>
                  <p>지역: {m.jobs?.region ?? "—"}</p>
                  <p>필요 경력: {m.jobs?.required_career ?? 0}년 이상</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
