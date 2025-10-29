import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Secret Santa Matcher",
  slug: "secret-santa-matcher",
  scheme: "secret-santa-matcher",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true
  },
  android: {},
  web: {
    bundler: "metro",
    output: "dist"
  },
  extra: {
    router: {
      basePath: "/secret-santa-matcher"
    }
  }
});
