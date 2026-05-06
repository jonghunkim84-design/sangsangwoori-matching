import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/register",
    title: "프로필 등록",
    description: "이름, 지역, 희망 직종, 경력을 입력하세요",
    icon: "📝",
  },
  {
    href: "/recommendations",
    title: "맞춤 일자리 추천",
    description: "내 프로필에 맞는 일자리를 확인하세요",
    icon: "⭐",
  },
  {
    href: "/admin",
    title: "담당자 대시보드",
    description: "매칭 현황을 관리하고 배정하세요",
    icon: "📋",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-bold text-gray-900">
          시니어 일자리 매칭
        </h1>
        <p className="text-2xl text-gray-600">
          경험과 역량에 맞는 일자리를 자동으로 찾아드립니다
        </p>
        <Link
          href="/register"
          className={cn(buttonVariants({ size: "lg" }), "text-xl px-10 py-6 mt-4")}
        >
          지금 시작하기
        </Link>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <Card className="h-full hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer">
              <CardHeader>
                <div className="text-5xl mb-2">{item.icon}</div>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
