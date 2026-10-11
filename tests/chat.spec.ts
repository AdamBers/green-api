import { expect, test } from '@playwright/test';

test('demo: send, receive and restore after reload', async ({ page }, testInfo) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('.green-api.com')) externalRequests.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Подключить WhatsApp' })).toBeDisabled();
  await page.screenshot({ path: testInfo.outputPath('connect.png'), fullPage: true });
  await page.getByRole('button', { name: 'Открыть демоверсию' }).click();
  await page.getByRole('button', { name: /Алексей/ }).click();
  await page.getByRole('textbox', { name: 'Сообщение', exact: true }).fill('Проверка сохранения');
  await page.getByRole('button', { name: 'Отправить сообщение' }).click();
  await expect(
    page.getByRole('log').getByText('Проверка сохранения', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('log').getByText(/Демоответ:/)).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('log').getByText('Проверка сохранения', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('log').getByText(/Демоответ:/)).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('conversation.png'), fullPage: true });
  expect(externalRequests).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
});

test('create chat: validation, duplicate prevention and URL navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Открыть демоверсию' }).click();
  await page.getByRole('button', { name: 'Создать новый чат' }).click();
  await page.getByRole('button', { name: 'Начать разговор' }).click();
  await expect(page.getByRole('alert')).toContainText('Введите полный номер');
  await page.getByRole('textbox', { name: 'Номер телефона' }).fill('+1 202 555 0123');
  await page.getByRole('textbox', { name: 'Имя' }).fill('Мария');
  await page.getByRole('button', { name: 'Начать разговор' }).click();
  await expect(page.getByRole('heading', { name: 'Мария' })).toBeVisible();
  await expect(page).toHaveURL(/chat=12025550123%40c.us/);
  if (await page.getByRole('button', { name: 'Назад к чатам' }).isVisible())
    await page.getByRole('button', { name: 'Назад к чатам' }).click();
  await page.getByRole('button', { name: 'Создать новый чат' }).click();
  await page.getByRole('textbox', { name: 'Номер телефона' }).fill('+1 (202) 555-0123');
  await page.getByRole('button', { name: 'Начать разговор' }).click();
  await expect(page.getByRole('heading', { name: 'Мария' })).toBeVisible();
  if (await page.getByRole('button', { name: 'Назад к чатам' }).isVisible())
    await page.getByRole('button', { name: 'Назад к чатам' }).click();
  await expect(page.getByRole('button', { name: /Мария/ })).toHaveCount(1);
  await page.getByRole('textbox', { name: 'Поиск чатов' }).fill('никого');
  await expect(page.getByText('Разговоры не найдены')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Поиск чатов' })).toHaveValue('никого');
});

test('dialog: Escape closes and restores focus; logout clears data', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Открыть демоверсию' }).click();
  await page.getByRole('button', { name: 'Создать новый чат' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Создать новый чат' })).toBeFocused();
  await page.getByRole('button', { name: 'Выйти', exact: true }).filter({ visible: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Выйти', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Давайте подключимся' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Давайте подключимся' })).toBeVisible();
  await page.getByRole('button', { name: 'Открыть демоверсию' }).click();
  await expect(page.getByRole('button', { name: /Алексей/ })).toHaveCount(1);
});

test('browser back and forward restore selected conversation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Открыть демоверсию' }).click();
  await page.getByRole('button', { name: /Алексей/ }).click();
  await expect(page.getByRole('log')).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('button', { name: /Алексей/ })).toBeVisible();
  await expect(page.getByRole('log')).toHaveCount(0);
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Алексей' })).toBeVisible();
  await expect(page.getByRole('log')).toBeVisible();
});
