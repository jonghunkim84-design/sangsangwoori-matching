"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { REGIONS, JOB_TYPES } from "@/lib/constants";
import type { Job } from "@/lib/supabase";
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

type NewJob = {
  title: string;
  region: string;
  job_type: string;
  required_career: string;
};

type FieldErrors = Partial<Record<keyof NewJob, string>>;

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-400 bg-red-50 px-4 py-2 text-base font-medium text-red-700">
      {message}
    </div>
  );
}

export default function JobManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<NewJob>({
    title: "",
    region: "",
    job_type: "",
    required_career: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    setJobs((data ?? []) as Job[]);
  }

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!form.title.trim()) errs.title = "공고명을 입력해 주세요.";
    if (!form.region) errs.region = "지역을 선택해 주세요.";
    if (!form.job_type) errs.job_type = "직종을 선택해 주세요.";
    return errs;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setAdding(true);
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        title: form.title.trim(),
        region: form.region,
        job_type: form.job_type,
        required_career: parseInt(form.required_career) || 0,
      })
      .select()
      .single();

    setAdding(false);
    if (error || !data) return;

    // 새 일자리에 대해 기존 시니어 재매칭
    await supabase.rpc("match_job", { p_job_id: (data as Job).id });

    setJobs((prev) => [data as Job, ...prev]);
    setForm({ title: "", region: "", job_type: "", required_career: "" });
    setErrors({});
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await supabase.from("jobs").delete().eq("id", id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDeletingId(null);
  }

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">일자리 관리</h2>

      {/* 추가 폼 */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl">일자리 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} noValidate className="space-y-5">

            {/* 공고명 */}
            <div className="space-y-2">
              {errors.title && <ErrorBox message={errors.title} />}
              <Label htmlFor="job-title" className="text-xl font-semibold">
                공고명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="job-title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="예: 강남 경비원 모집"
                className={cn("text-xl h-14 px-4", errors.title && "border-red-400")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className={cn("text-xl h-14", errors.region && "border-red-400")}
                  >
                    <SelectValue placeholder="지역 선택" />
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

              {/* 직종 */}
              <div className="space-y-2">
                {errors.job_type && <ErrorBox message={errors.job_type} />}
                <Label className="text-xl font-semibold">
                  직종 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.job_type}
                  onValueChange={(v) => v && setForm((p) => ({ ...p, job_type: v }))}
                >
                  <SelectTrigger
                    className={cn("text-xl h-14", errors.job_type && "border-red-400")}
                  >
                    <SelectValue placeholder="직종 선택" />
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
            </div>

            {/* 요구 경력 */}
            <div className="space-y-2">
              <Label htmlFor="required-career" className="text-xl font-semibold">
                요구 경력 (년)
              </Label>
              <Input
                id="required-career"
                type="number"
                min="0"
                value={form.required_career}
                onChange={(e) =>
                  setForm((p) => ({ ...p, required_career: e.target.value }))
                }
                placeholder="없으면 0"
                className="text-xl h-14 px-4"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="text-xl py-6 px-10"
              disabled={adding}
            >
              {adding ? "추가 중..." : "일자리 추가"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 일자리 목록 */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl">
            등록된 일자리{" "}
            <span className="text-gray-500 font-normal">({jobs.length}건)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="py-10 text-center text-lg text-gray-400">
              등록된 일자리가 없습니다. 위 폼에서 추가해 주세요.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-lg">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">공고명</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">지역</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">직종</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">요구 경력</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 font-medium">{job.title}</td>
                      <td className="px-4 py-4">{job.region}</td>
                      <td className="px-4 py-4">{job.job_type}</td>
                      <td className="px-4 py-4">{job.required_career}년 이상</td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                          className="text-base px-5 py-2"
                        >
                          {deletingId === job.id ? "삭제 중..." : "삭제"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
