import { getContactConfig } from "@/lib/contact/config";
import { handleContact } from "@/lib/contact/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

export async function POST(request: Request) {
  return handleContact(request, getContactConfig());
}
