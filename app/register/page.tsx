"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { REGIONS, JOB_TYPES } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  region: string;
  desired_job: string;
  career_years: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-lg font-medium text-red-700">
      {message}
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    region: "",
    desired_job: "",
    career_years: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [successSeniorId, setSuccessSeniorId] = useState<string | null>(null);
  const [serverError, setServerError] = useState("");

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!form.name.trim()) errs.name = "이름을 입력해 주세요.";
    if (!form.region) errs.region = "지역을 선택해 주세요.";
    if (!form.desired_job) errs.desired_job = "희망 직종을 선택해 주세요.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setServerError("");

    const { data: senior, error } = await supabase
      .from("seniors")
      .insert({
        name: form.name.trim(),
        region: form.region,
        desired_job: form.desired_job,
        career_years: parseInt(form.career_years) || 0,
      })
      .select()
      .single();

    if (error || !senior) {
      setLoading(false);
      setServerError("등록에 실패했습니다. 다시 시도해 주세요.");
      return;
    }

    // 규칙 기반 자동 매칭 실행
    await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senior_id: senior.id }),
    });

    setLoading(false);
    setSuccessSeniorId(senior.id);
    setForm({ name: "", region: "", desired_job: "", career_years: "" });
    setErrors({});
  }

  if (successSeniorId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border-2 border-green-400 bg-green-50 p-10 text-center space-y-6">
          <p className="text-4xl font-bold text-green-800">등록이 완료되었습니다</p>
          <p className="text-xl text-green-700">
            자동 매칭이 완료되었습니다. 추천 결과를 확인해 보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={() => setSuccessSeniorId(null)}
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-xl py-6 px-10 bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50"
              )}
            >
              추가 등록
            </button>
            <a
              href={`/recommendations?senior_id=${successSeniorId}`}
              className={cn(buttonVariants({ size: "lg" }), "text-xl py-6 px-10")}
            >
              내 추천 보기
            </a>
          </div>
        </div>
      </div>
    );
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
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* 이름 */}
            <div className="space-y-2">
              {errors.name && <ErrorBox message={errors.name} />}
              <Label htmlFor="name" className="text-xl font-semibold">
                이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="홍길동"
                className={cn("text-xl h-14 px-4", errors.name && "border-red-400")}
              />
            </div>

            {/* 지역 */}
            <div className="space-y-2">
              {errors.region && <ErrorBox message={errors.region} />}
              <Label className="text-xl font-semibold">
                지역 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.region}
                onValueChange={(v) => v && setForm((p) => ({ ...p, region: v }))}
              >
                <SelectTrigger
                  className={cn("text-xl h-14 px-4", errors.region && "border-red-400")}
                >
                  <SelectValue placeholder="지역을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r} className="text-xl py-3">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 희망 직종 */}
            <div className="space-y-2">
              {errors.desired_job && <ErrorBox message={errors.desired_job} />}
              <Label className="text-xl font-semibold">
                희망 직종 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.desired_job}
                onValueChange={(v) => v && setForm((p) => ({ ...p, desired_job: v }))}
              >
                <SelectTrigger
                  className={cn("text-xl h-14 px-4", errors.desired_job && "border-red-400")}
                >
                  <SelectValue placeholder="희망 직종을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((j) => (
                    <SelectItem key={j} value={j} className="text-xl py-3">
                      {j}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 경력 */}
            <div className="space-y-2">
              <Label htmlFor="career_years" className="text-xl font-semibold">
                경력 (년)
              </Label>
              <Input
                id="career_years"
                type="number"
                min="0"
                value={form.career_years}
                onChange={(e) => setForm((p) => ({ ...p, career_years: e.target.value }))}
                placeholder="없으면 0"
                className="text-xl h-14 px-4"
              />
            </div>

            {serverError && <ErrorBox message={serverError} />}

            <Button
              type="submit"
              size="lg"
              className="w-full text-xl py-6"
              disabled={loading}
            >
              {loading ? "등록 중..." : "등록하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
