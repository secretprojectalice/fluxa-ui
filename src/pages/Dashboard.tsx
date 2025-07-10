import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppSidebar } from '@/components/appsidebar'

interface DashboardProps {
    onSignOut: () => void
}

export default function Dashboard({ onSignOut }: DashboardProps) {
    return (
        <SidebarProvider>
            <AppSidebar onSignOut={onSignOut} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="text-slate-300 hover:text-white" />
                        <Separator orientation="vertical" className="mr-2 h-4 bg-slate-600" />
                        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white">Welcome</CardTitle>
                                <CardDescription className="text-slate-400">You're successfully signed in</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300">
                                    This is your dashboard. Use the sidebar to navigate between different sections.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white">Quick Stats</CardTitle>
                                <CardDescription className="text-slate-400">Overview of your activity</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-400">42</div>
                                <p className="text-xs text-slate-400">Total items</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white">Recent Activity</CardTitle>
                                <CardDescription className="text-slate-400">Latest updates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300">No recent activity</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="min-h-[100vh] flex-1 rounded-xl bg-slate-800/30 border border-slate-700 backdrop-blur-sm p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Main Content Area</h2>
                        <p className="text-slate-300">
                            This is the main content area of your dashboard. You can add your application content here.
                        </p>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
