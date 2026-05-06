"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fields = [
  { id: "name",        label: "이름",      placeholder: "홍길동",              type: "text"   },
  { id: "region",      label: "거주 지역",  placeholder: "예: 서울 강남구",      type: "text"   },
  { id: "desired_job", label: "희망 직종",  placeholder: "예: 경비원, 요양보호사", type: "text"   },
  { id: "career_years",label: "경력 (년)",  placeholder: "예: 10",              type: "number" },
] as const;

type FormState = Record<(typeof fields)[number]["id"], string>;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "", region: "", desired_job: "", career_years: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (id: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [id]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. 시니어 등록
    const { data: senior, error: insertError } = await supabase
      .from("seniors")
      .insert({
        name:         form.name.trim(),
        region:       form.region.trim(),
        desired_job:  form.desired_job.trim(),
        career_years: parseInt(form.career_years) || 0,
      })
      .select()
      .single();

    if (insertError || !senior) {
      setError("등록에 실패했습니다. 다시 시도해 주세요.");
      setLoading(false);
      return;
    }

    // 2. 규칙 기반 매칭 실행
    await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senior_id: senior.id }),
    });

    // 3. 추천 결과 페이지로 이동
    router.push(`/recommendations?senior_id=${senior.id}`);
  }

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
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map(({ id, label, placeholder, type }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id} className="text-xl font-semibold">
                  {label}
                </Label>
                <Input
                  id={id}
                  type={type}
                  min={type === "number" ? "0" : undefined}
                  value={form[id]}
                  onChange={handleChange(id)}
                  placeholder={placeholder}
                  className="text-xl h-14 px-4"
                  required
                />
              </div>
            ))}

            {error && (
              <p className="text-red-600 text-lg font-medium">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full text-xl py-6"
              disabled={loading}
            >
              {loading ? "등록 및 매칭 중..." : "등록하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
