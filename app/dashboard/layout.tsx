import { redirect } from "next/navigation";

import { AppKnockProviders } from "@/providers/knock-provider";
import { DashboardLayout } from "./_components/dashboard-layout";
import { auth } from "@/auth";
import { WebPushProvider } from "@/providers/web-push-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.userId) {
    redirect("/");
  }
  return (
    <WebPushProvider>
      <AppKnockProviders userId={session.userId}>
        <DashboardLayout>{children}</DashboardLayout>
      </AppKnockProviders>
    </WebPushProvider>
  );
}
