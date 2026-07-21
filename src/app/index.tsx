import { Redirect } from "expo-router";

export default function Index() {
  // Always intercept fresh app boots to launch the animated flag canvas instantly
  return <Redirect href={"/patriotic-splash" as any} />;
}
