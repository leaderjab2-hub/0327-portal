import { requireCurrentUser } from "@/lib/auth";
import { getNotices } from "@/lib/serverPageData";
import NoticesPageClient from "./NoticesPageClient";

export default async function Page() {
  let initialNotices: Awaited<ReturnType<typeof getNotices>> = [];

  try {
    await requireCurrentUser();
    initialNotices = await getNotices();
  } catch (error) {
    console.error("[support/notices] failed to load page data", error);
  }

  return <NoticesPageClient initialNotices={initialNotices} />;
}
