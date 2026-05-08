import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const db = createClient(url, key, { auth: { persistSession: false } });

export async function resetDb() {
  await db.from("matches").delete().not("id", "is", null);
  await db.from("seniors").delete().not("id", "is", null);
  await db.from("jobs").delete().not("id", "is", null);
}

export async function seedJob(opts: {
  title?: string;
  region: string;
  job_type: string;
  required_career: number;
}) {
  const { data, error } = await db
    .from("jobs")
    .insert({
      title: opts.title ?? "테스트 공고",
      region: opts.region,
      job_type: opts.job_type,
      required_career: opts.required_career,
    })
    .select()
    .single();
  if (error) throw new Error(`seedJob 실패: ${error.message}`);
  return data;
}
