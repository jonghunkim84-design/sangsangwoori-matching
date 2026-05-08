import type { Senior, Job } from "./supabase";

export type MatchScore = {
  senior_id: string;
  job_id: string;
  score: number;
};

const REGION_MAP: Record<string, string> = {
  서울특별시: "서울",
  경기도: "경기",
  인천광역시: "인천",
};

const JOB_MAP: Record<string, string> = {
  경비직: "경비",
  청소직: "청소",
  조리직: "조리",
  돌봄직: "돌봄",
};

function normalizeRegion(r: string) {
  return REGION_MAP[r.trim()] ?? r.trim();
}

function normalizeJob(j: string) {
  return JOB_MAP[j.trim()] ?? j.trim();
}

export function calculateScore(senior: Senior, job: Job): number {
  let score = 0;
  if (normalizeRegion(senior.region) === normalizeRegion(job.region)) score += 3;
  if (normalizeJob(senior.desired_job) === normalizeJob(job.job_type)) score += 2;
  if (senior.career_years >= job.required_career) score += 1;
  return score;
}

export function runMatching(senior: Senior, jobs: Job[]): MatchScore[] {
  return jobs
    .map((job) => ({
      senior_id: senior.id,
      job_id: job.id,
      score: calculateScore(senior, job),
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}
