import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from '../AppSidebar'

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const handleNavigate = (url: string) => {
    console.log(`Navigate to: ${url}`);
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-96 w-full border rounded-md overflow-hidden">
        <AppSidebar activeItem="/library" onNavigate={handleNavigate} />
        <div className="flex-1 p-4 bg-background">
          <p className="text-muted-foreground">Main content area would be here</p>
        </div>
      </div>
    </SidebarProvider>
  )
}