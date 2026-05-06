import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "미매칭",
    description: "아직 매칭되지 않은 시니어",
    color: "bg-red-50 border-red-200",
    badgeClass: "bg-red-100 text-red-800",
    count: "--",
  },
  {
    title: "매칭 대기",
    description: "매칭 후 담당자 승인 대기 중",
    color: "bg-yellow-50 border-yellow-200",
    badgeClass: "bg-yellow-100 text-yellow-800",
    count: "--",
  },
  {
    title: "배정 완료",
    description: "일자리 배정이 확정된 시니어",
    color: "bg-green-50 border-green-200",
    badgeClass: "bg-green-100 text-green-800",
    count: "--",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">담당자 대시보드</h1>
        <p className="mt-2 text-xl text-gray-600">
          매칭 현황을 한눈에 확인하고 배정을 관리하세요
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-6">
        {sections.map((s) => (
          <Card key={s.title} className={`border-2 ${s.color}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-gray-700">{s.count}</p>
              <p className="text-lg text-gray-500 mt-1">{s.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 상세 목록 자리 */}
      <div className="space-y-6">
        {sections.map((s) => (
          <section key={s.title}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">{s.title}</h2>
              <Badge className={`text-base px-3 py-1 ${s.badgeClass}`}>
                0건
              </Badge>
            </div>
            <Card className={`border-2 ${s.color} opacity-50`}>
              <CardContent className="py-8">
                <p className="text-center text-xl text-gray-400">
                  {s.title} 목록이 여기에 표시됩니다 (다음 단계에서 구현)
                </p>
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
    </div>
  );
}
