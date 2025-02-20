import { Separator } from "@/components/ui/separator";
import { SettingsForm } from "./_components/settings-form";
import { ProfileForm } from "./_components/profile-form";
import { SecurityForm } from "./_components/security-form";
import PageContainer from "../../_components/page-container";
import { Heading } from "@/components/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function SettingsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Heading
          title="Settings"
          description="Manage your account settings and preferences"
        />
        <Separator />
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <SettingsForm />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          <TabsContent value="security">
            <SecurityForm />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
