"use client"

import { Home, Settings, LogOut, LinkIcon, Languages } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    // SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: Home,
    },
    {
        title: "Language Trainer",
        url: "#",
        icon: Languages,
    },
    {
        title: "Link 2",
        url: "#",
        icon: LinkIcon,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

interface AppSidebarProps {
    onSignOut: () => void
}

export function AppSidebar({ onSignOut }: AppSidebarProps) {
    return (
        <Sidebar>
            {/* <SidebarHeader className="border-b border-slate-700 p-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
                        <span className="text-sm font-bold text-white">A</span>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-white">My App</span>
                        <span className="truncate text-xs text-slate-400">Dashboard</span>
                    </div>
                </div>
            </SidebarHeader> */}

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-700 text-lg mb-5">Fluxa</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="hover:text-white hover:bg-gray-700">
                                        <a href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <Button
                    onClick={onSignOut}
                    variant="ghost"
                    className="w-full justify-start hover:text-white hover:bg-gray-700"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}
