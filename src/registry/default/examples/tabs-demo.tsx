import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/default/ui/tabs"

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-sm">
      <TabsList>
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="activity">Activity</TabsTab>
        <TabsTab value="settings">Settings</TabsTab>
      </TabsList>
      <TabsPanel value="overview" className="text-muted-foreground">
        Workspace stats at a glance.
      </TabsPanel>
      <TabsPanel value="activity" className="text-muted-foreground">
        Recent changes by your team.
      </TabsPanel>
      <TabsPanel value="settings" className="text-muted-foreground">
        Names, members and billing.
      </TabsPanel>
    </Tabs>
  )
}
