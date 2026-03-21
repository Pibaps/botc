import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.botc.guide",
  appName: "Blood on the Clocktower Guide",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;