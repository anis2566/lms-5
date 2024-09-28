import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardLayout } from "./_components/dashboard-layout";
import { AppKnockProviders } from "@/providers/knock-provider";
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
