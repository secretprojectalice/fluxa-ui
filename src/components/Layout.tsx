import { Separator } from '@radix-ui/react-separator'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from './ui/sidebar'

interface LayoutProps {
    onSignOut: () => void
}

export default function Layout({ onSignOut }: LayoutProps) {
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
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}