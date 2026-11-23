import { CONTACT_LIMITS, parseContactDetails } from "./contact/schema";

export const BUSINESS_PROFILE_ISSUES = {
  address: "My address change is not showing",
  location: "My profile shows the wrong location",
  verification: "Google is asking me to verify again",
  unsure: "I'm not sure what the problem is",
} as const;

export const BUSINESS_PROFILE_LIMITS = { profileUrl: 500, details: 2000 } as const;
export type BusinessProfileValues = {
  issue: string;
  businessName: string;
  profileUrl: string;
  details: string;
  name: string;
  email: string;
  website: string;
};

export const EMPTY_BUSINESS_PROFILE: BusinessProfileValues = {
  issue: "", businessName: "", profileUrl: "", details: "", name: "", email: "", website: "",
};

export type BusinessProfileError = { field: keyof BusinessProfileValues; message: string };
const singleLineControls = /[\u0000-\u001f\u007f]/;

export function validateBusinessProfileStep(values: BusinessProfileValues, step: number): BusinessProfileError | null {
  if (step === 0 && !Object.hasOwn(BUSINESS_PROFILE_ISSUES, values.issue)) {
    return { field: "issue", message: "Choose the option closest to your situation." };
  }
  if (step === 1) {
    if (!values.businessName.trim() || values.businessName.length > CONTACT_LIMITS.context || singleLineControls.test(values.businessName)) {
      return { field: "businessName", message: "Enter your business name, up to 160 characters." };
    }
    const profileUrl = values.profileUrl.trim();
    if (profileUrl) {
      try {
        const url = new URL(profileUrl);
        if (profileUrl.length > BUSINESS_PROFILE_LIMITS.profileUrl || /\s/.test(profileUrl) || singleLineControls.test(profileUrl) ||
          !["https:", "http:"].includes(url.protocol) || !url.hostname || url.username || url.password) throw new Error("url");
      } catch {
        return { field: "profileUrl", message: "Use a public link beginning with https:// or http://, or leave this blank." };
      }
    }
  }
  if (step === 2 && (values.details.trim().length < CONTACT_LIMITS.messageMin || values.details.length > BUSINESS_PROFILE_LIMITS.details || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(values.details))) {
    return { field: "details", message: "Add a short description, between 10 and 2,000 characters." };
  }
  if (step === 3 && (!values.name.trim() || values.name.length > CONTACT_LIMITS.name || singleLineControls.test(values.name))) {
    return { field: "name", message: "Enter your name, up to 100 characters." };
  }
  if (step === 4 && (values.email.trim().length > CONTACT_LIMITS.email || !/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(values.email.trim()))) {
    return { field: "email", message: "Enter an email address I can reply to." };
  }
  return null;
}

export function createBusinessProfileDetails(values: BusinessProfileValues) {
  if ([0, 1, 2, 3, 4].some(step => validateBusinessProfileStep(values, step))) return null;
  const issue = BUSINESS_PROFILE_ISSUES[values.issue as keyof typeof BUSINESS_PROFILE_ISSUES];
  const message = [
    `Help needed: ${issue}`,
    `Profile link: ${values.profileUrl.trim() || "Not provided"}`,
    `What's happening:\n${values.details.trim()}`,
  ].join("\n\n");
  return parseContactDetails({
    category: "business_profile", name: values.name.trim(), email: values.email.trim(),
    context: values.businessName.trim(), message,
  });
}
