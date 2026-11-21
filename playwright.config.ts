import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://127.0.0.1:5174" },
  projects: [{ name: "phone", use: { ...devices["Pixel 7"] } }],
  webServer: {
    command: "pnpm dev --port 5174 --strictPort --host 127.0.0.1",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: !process.env.CI,
  },
})
