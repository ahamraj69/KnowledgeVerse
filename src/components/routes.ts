export const Routes = {
  Splash: "/patriotic-splash",
  Onboarding: "/onboarding",
  Login: "/login",
  Signup: "/signup",
  Feed: "/feed",
  Explore: "/explore",
  Progress: "/progress",
  Settings: "/settings",
  AI: "/ai",
} as const;

export type RoutePath = typeof Routes[keyof typeof Routes];
