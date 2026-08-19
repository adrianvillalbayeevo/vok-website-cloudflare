import { ASSETS } from "@/config/assets";
export const heroData = {
  headline: ["Your club.", "Your platform."],
  subheadline:
    "Stop adapting your club to someone else's software. We build your own platform around the way you actually operate.",
  supportingLine:
    "Registrations. Payments. Programs. Teams. Communication. Your workflows. Your rules. Your brand.",
  primaryCta: "BUILD WITH VOK",
  secondaryCta: "SEE HOW IT WORKS",
  stats: [
    { icon: "ri-check-double-line", label: "Custom-built for your operation" },
    { icon: "ri-rocket-line", label: "Live in weeks, not months" },
    { icon: "ri-shield-check-line", label: "Your brand, your data, your rules" },
  ],
};

export const caseStudiesData = [
  {
    name: "Basketball Academy \u2014 Dallas",
    shortName: "Basketball Academy",
    description:
      "A Dallas youth basketball academy was running on a generic sports platform with spreadsheets and workarounds. VOK built their own platform around the way they operate.",
    result:
      "Their own branded website, online registration, and card & ACH payments \u2014 replacing multiple disconnected tools.",
    features: ["Custom Website", "Registration", "Payments", "Admin Dashboard"],
    image: ASSETS.caseMockup,
  },
  {
    name: "Girls' Basketball Club \u2014 Dallas",
    shortName: "Girls' Basketball Club",
    description:
      "A local girls' basketball club in Dallas getting its own platform \u2014 built around the way they run their programs.",
    result:
      "Registration, memberships, payments, schedules and parent communication, all under their own brand.",
    features: ["Custom Website", "Registration", "Memberships", "Payments"],
    image: ASSETS.caseMockup,
  },
];