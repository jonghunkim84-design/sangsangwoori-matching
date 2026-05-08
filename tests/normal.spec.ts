import { test, expect } from "@playwright/test";
import { resetDb, seedJob } from "./helpers/db";

// 사전 조건: 서울/경비/요구경력3년 공고 1건
test.beforeEach(async () => {
  await resetDb();
  await seedJob({ title: "서울 경비원 모집", region: "서울", job_type: "경비", required_career: 3 });
});

test("정상 시나리오: 등록 → 자동매칭 → 6점 금색 배지 최상단 표시", async ({ page }) => {
  await page.goto("/register");

  // 이름
  await page.fill("#name", "테스트시니어");

  // 지역 선택 (첫 번째 combobox) — Radix Select 특정 옵션 visible 대기
  await page.getByRole("combobox").nth(0).click();
  await page.getByRole("option", { name: "서울" }).waitFor({ state: "visible" });
  await page.getByRole("option", { name: "서울" }).click();

  // 희망 직종 선택 (두 번째 combobox)
  await page.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: "경비" }).waitFor({ state: "visible" });
  await page.getByRole("option", { name: "경비" }).click();

  // 경력 5년 (3점+2점+1점=6점 기대)
  await page.fill("#career_years", "5");

  // 제출
  await page.getByRole("button", { name: "등록하기" }).click();

  // 성공 박스 확인
  await expect(page.getByText("등록이 완료되었습니다")).toBeVisible({ timeout: 10_000 });

  // 추천 링크 추출 후 이동
  const recLink = page.getByRole("link", { name: "내 추천 보기" });
  const href = await recLink.getAttribute("href");
  expect(href).toMatch(/\/recommendations\?senior_id=.+/);

  await recLink.click();
  await page.waitForURL(/\/recommendations\?senior_id=/, { timeout: 10_000 });

  // 6점 금색 배지 (bg-yellow-400)가 최상단에 표시되는지 확인
  const firstBadge = page.locator(".bg-yellow-400").first();
  await expect(firstBadge).toBeVisible({ timeout: 10_000 });
  await expect(firstBadge).toContainText("6점");
});
