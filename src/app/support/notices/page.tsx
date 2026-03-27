import { requireCurrentUser } from "@/lib/auth";
import { getNotices } from "@/lib/serverPageData";
import NoticesPageClient from "./NoticesPageClient";

export default async function Page() {
  await requireCurrentUser();
  const initialNotices = await getNotices();
  return <NoticesPageClient initialNotices={initialNotices} />;
}
