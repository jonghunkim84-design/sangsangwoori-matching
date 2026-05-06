import type { Senior, Job } from "./supabase";

export type MatchScore = {
  senior_id: string;
  job_id: string;
  score: number;
};

export function calculateScore(senior: Senior, job: Job): number {
  let score = 0;
  if (senior.region.trim() === job.region.trim()) score += 3;
  if (senior.desired_job.trim() === job.job_type.trim()) score += 2;
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
