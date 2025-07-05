import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogoutButton } from "@/components/auth/logout-button";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

export default async function BannedPage() {
  const session = await auth();

  if (!session || session.user?.role !== UserRole.BANNED) {
    redirect("/");
  }
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-background p-4">
      <Alert variant="destructive" className="max-w-[500px]">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Account Banned</AlertTitle>
        <AlertDescription className="mt-2">
          Your account has been banned from accessing this website. If you
          believe this is a mistake, please contact support.
        </AlertDescription>
      </Alert>
      <LogoutButton>Sign Out</LogoutButton>
    </div>
  );
}
