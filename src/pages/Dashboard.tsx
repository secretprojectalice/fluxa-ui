import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from '@/components/appsidebar'

interface DashboardProps {
    onSignOut: () => void
}

export default function Dashboard({ onSignOut }: DashboardProps) {
    return (
        <SidebarProvider>
            <AppSidebar onSignOut={onSignOut} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <h1>Dashboard</h1>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 min-h-screen">
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}
