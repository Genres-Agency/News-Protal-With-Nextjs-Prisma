import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";
import Header from "../_components/header";
import KBar from "@/components/kbar";
import { redirect } from "next/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Providers } from "./_components/providers";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { UserRole } from "@prisma/client";
import { auth } from "@/server/auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  if (session.user.role === UserRole.USER) {
    return redirect("/pending");
  }

  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast: "group toast-group",
              title: "toast-title",
              description: "toast-description",
              actionButton: "toast-action-button",
              cancelButton: "toast-cancel-button",
              error: "toast-error",
              success: "toast-success",
              warning: "toast-warning",
              info: "toast-info",
            },
            duration: 4000,
          }}
        />
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background text-foreground">
              <KBar>
                <SidebarProvider defaultOpen={true}>
                  <AppSidebar />
                  <SidebarInset className="flex flex-col h-screen overflow-hidden">
                    <Header />
                    <RoleGuard
                      allowedRoles={[
                        UserRole.ADMIN,
                        UserRole.SUPERADMIN,
                        UserRole.JOURNALIST,
                      ]}
                      redirectTo="/"
                    >
                      <Suspense
                        fallback={
                          <div className="flex items-center justify-center h-full">
                            Loading...
                          </div>
                        }
                      >
                        <div className="flex-1 overflow-y-auto">{children}</div>
                      </Suspense>
                    </RoleGuard>
                  </SidebarInset>
                </SidebarProvider>
              </KBar>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
};

export default ProtectedLayout;
