import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

// pnpm build で作った out/ を、GitHub Pages と同じ振る舞いの静的サーバー（e2e/serve.mjs）で配信して確かめる
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    // 手元でブラウザを落とせないときは PW_CHANNEL=chrome でインストール済みの Chrome を使う
    channel: process.env.PW_CHANNEL,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "node e2e/serve.mjs",
    env: { PORT: String(PORT) },
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
});
