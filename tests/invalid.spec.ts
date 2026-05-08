import { test, expect } from "@playwright/test";
import { resetDb, db } from "./helpers/db";

// 사전 조건: DB 클린 상태
test.beforeEach(async () => {
  await resetDb();
});

test("실패 시나리오: 이름 미입력 → 빨간 에러 박스 표시, DB 미삽입", async ({ page }) => {
  await page.goto("/register");

  // 이름 비움 (입력하지 않음)
  // 지역 선택
  await page.getByRole("combobox").nth(0).click();
  await page.getByRole("option", { name: "서울" }).waitFor({ state: "visible" });
  await page.getByRole("option", { name: "서울" }).click();

  // 희망 직종 선택
  await page.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: "경비" }).waitFor({ state: "visible" });
  await page.getByRole("option", { name: "경비" }).click();

  // 경력
  await page.fill("#career_years", "3");

  // 제출
  await page.getByRole("button", { name: "등록하기" }).click();

  // 이름 필드 위 빨간 에러 박스 표시 확인
  await expect(page.getByText("이름을 입력해 주세요.")).toBeVisible();

  // seniors 테이블에 레코드가 삽입되지 않았는지 확인
  const { count } = await db
    .from("seniors")
    .select("*", { count: "exact", head: true });
  expect(count).toBe(0);
});
