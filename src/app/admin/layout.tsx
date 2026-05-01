import { redirect } from "next/navigation";
import { auth, isAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const admin = await isAdmin(session.user.id);
  if (!admin) {
    redirect("/");
  }

  return <>{children}</>;
}
