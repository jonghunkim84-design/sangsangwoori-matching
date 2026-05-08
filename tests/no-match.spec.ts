import { test, expect } from "@playwright/test";
import { resetDb, seedJob } from "./helpers/db";

// 사전 조건: 서울/경비 시니어와 절대 안 맞는 공고
// (지역·직종 모두 다르고 required_career=99 → 점수 합계 0 → 매칭 없음)
test.beforeEach(async () => {
  await resetDb();
  await seedJob({ title: "기타 공고", region: "기타", job_type: "기타", required_career: 99 });
});

test("엣지 시나리오: 매칭 없는 시니어 → '현재 매칭되는 일자리가 없습니다' 표시", async ({
  page,
}) => {
  await page.goto("/register");

  // 이름
  await page.fill("#name", "노매칭시니어");

  // 지역: 서울
  await page.getByRole("combobox").nth(0).click();
  await page.getByRole("option", { name: "서울" }).waitFor({ state: "visible" });
  await page.getByRole("option", { name: "서울" }).click();

  // 희망 직종: 경비
  await page.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: "경비" }).waitFor({ state: "visible" });
  await page.getByRole("option", { name: "경비" }).click();

  // 경력
  await page.fill("#career_years", "3");

  // 제출
  await page.getByRole("button", { name: "등록하기" }).click();

  // 등록 성공 확인
  await expect(page.getByText("등록이 완료되었습니다")).toBeVisible({ timeout: 10_000 });

  // 추천 페이지로 이동
  await page.getByRole("link", { name: "내 추천 보기" }).click();
  await page.waitForURL(/\/recommendations\?senior_id=/, { timeout: 10_000 });

  // 매칭 없음 안내 메시지 확인
  await expect(page.getByText("현재 매칭되는 일자리가 없습니다")).toBeVisible({ timeout: 10_000 });
});
