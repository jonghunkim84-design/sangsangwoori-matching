import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">맞춤 일자리 추천</h1>
        <p className="mt-2 text-xl text-gray-600">
          매칭 점수 순으로 추천 일자리가 표시됩니다
        </p>
      </div>

      {/* 필터 영역 자리 */}
      <div className="flex gap-4 flex-wrap items-center">
        <span className="text-lg text-gray-500 font-medium">필터:</span>
        <Badge variant="outline" className="text-lg px-4 py-2">
          지역 (다음 단계)
        </Badge>
        <Badge variant="outline" className="text-lg px-4 py-2">
          직종 (다음 단계)
        </Badge>
      </div>

      {/* 추천 목록 자리 */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-2 border-gray-200 opacity-40">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-2xl text-gray-400">
                  일자리 추천 카드 #{i} — 데이터 로드 예정
                </CardTitle>
                <Badge className="text-lg px-4 py-2 shrink-0 bg-gray-300">
                  점수: --
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xl text-gray-400">직종: —</p>
              <p className="text-xl text-gray-400">지역: —</p>
              <p className="text-xl text-gray-400">필요 경력: — 년</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-lg text-gray-400 py-6">
        프로필을 등록하면 이 자리에 맞춤 추천 결과가 표시됩니다
      </p>
    </div>
  );
}
