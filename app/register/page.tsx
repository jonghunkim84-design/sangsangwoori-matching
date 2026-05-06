import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">프로필 등록</h1>
        <p className="mt-2 text-xl text-gray-600">
          정보를 입력하시면 맞춤 일자리를 추천해 드립니다
        </p>
      </div>

      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl">기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xl font-semibold">
                이름
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="홍길동"
                className="text-xl h-14 px-4"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region" className="text-xl font-semibold">
                거주 지역
              </Label>
              <Input
                id="region"
                name="region"
                placeholder="예: 서울 강남구"
                className="text-xl h-14 px-4"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desired_job" className="text-xl font-semibold">
                희망 직종
              </Label>
              <Input
                id="desired_job"
                name="desired_job"
                placeholder="예: 경비원, 요양보호사, 사무보조"
                className="text-xl h-14 px-4"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="career_years" className="text-xl font-semibold">
                경력 (년)
              </Label>
              <Input
                id="career_years"
                name="career_years"
                type="number"
                placeholder="예: 10"
                className="text-xl h-14 px-4"
                disabled
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-xl py-6"
              disabled
            >
              등록하기 (다음 단계에서 구현)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
