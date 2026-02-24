"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Plus, Settings2, BookOpen, MoreHorizontal, User, CreditCard, LogOut } from "lucide-react"
import { SettingsDialog } from "@/components/settings-dialog"
import { DocsDialog } from "@/components/docs-dialog"
import { useSidebar } from "@/components/ui/sidebar"
import * as React from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Skeleton } from "./ui/skeleton"
import { getUser } from "@/lib/getUser"

interface ChatRoom {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

export function NotesSidebar() {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [chatRooms, setChatRooms] = React.useState<ChatRoom[]>([]);
  const [docsOpen, setDocsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false);
  const { setOpenMobile, isMobile, state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [user, setUser] = React.useState<User | null>(null);
  const [mounted, setMounted] = React.useState(false);


  // Create a new chat room
  const handleMobileClick = async () => {
    if (isMobile) {
      setOpenMobile(false)
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to create a chat room');
        return;
      }

      const resp = await fetch('/api/v1/createChatRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `${token}`
        }
      })
      if (!resp.ok) {
        toast.error('Failed to create a chat room');
        return;
      }
      const response = await resp.json();
      console.log("Response: ", response);

      router.push(`/dashboard/c/${response.chatRoomId}`);
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Create chat room error:', error);
    }
  }

  // Handle logout
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Show success message
    toast.success('Logged out successfully');
    // Redirect to landing page
    router.push('/');
  }
  // Get all chat rooms
  React.useEffect(() => {
    const fetchChatRooms = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to get chat rooms');
        return;
      }
      try {
        setIsLoading(true);
        const resp = await fetch('/api/v1/getAllChatRooms', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `${token}`
          }
        })
        if (!resp.ok) {
          toast.error('Failed to get chat rooms');
          return;
        }
        const response = await resp.json();
        setChatRooms(response.data);
        setIsLoading(false);
      } catch (error) {
        toast.error('Error fetching chat rooms');
        console.error('Get chat rooms error:', error);
      }
    }
    fetchChatRooms();
  }, [])

  React.useEffect(() => {
    // Set mounted to true after component mounts (client-side only)
    setMounted(true);
    getUser().then((user) => {
      setUser(user);
    })
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const str = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return "Last updated: " + str;
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-zinc-50 text-slate-900 dark:bg-black dark:text-white relative">
      {/* Dashed Grid Background - matching home section (light mode only) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e7e5e4 1px, transparent 1px),
            linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            )
          `,
          WebkitMaskImage: `
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            )
          `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <SidebarHeader className={cn(
        "h-16 flex items-center justify-center relative z-10",
        isCollapsed ? "px-2" : "px-4"
      )}>
        <SidebarMenu className="w-full">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "w-full hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors rounded-xl relative z-10",
                isCollapsed
                  ? "justify-center px-2 py-2"
                  : "justify-start px-3 py-2"
              )}
            >
              <div className={cn(
                "flex aspect-square items-center justify-center rounded-lg shrink-0 overflow-hidden",
                isCollapsed ? "size-9" : "size-8"
              )}>
                <img
                  src="/vercel.svg"
                  alt="Notebook.io Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                  <span className="truncate font-semibold">Notebook.io</span>
                  <span className="truncate text-xs text-muted-foreground">Pro Plan</span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-4 relative z-10">
        <SidebarGroup>
          <SidebarGroupContent className={cn(
            isCollapsed ? "px-0" : "px-3"
          )}>
            <Button
              className={cn(
                "w-full gap-2 h-10 shadow-sm bg-white/80 dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200/60 dark:border-zinc-700 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-colors backdrop-blur-sm",
                isCollapsed
                  ? "justify-center px-0 w-8 mx-auto"
                  : "justify-start px-3"
              )}
              variant="outline"
              onClick={handleMobileClick}
            >
              <Plus className="size-4 shrink-0" />
              {!isCollapsed && <span>New Chat</span>}
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarMenu className={cn(
            isCollapsed ? "px-0" : "px-3"
          )}>
            <SidebarMenuItem
              onClick={() => {
                setDocsOpen(true)
                handleMobileClick()
              }}
            >
              <SidebarMenuButton
                className={cn(
                  "w-full h-10 rounded-xl hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors text-slate-900 dark:text-white",
                  isCollapsed
                    ? "justify-center px-0 w-10 mx-auto"
                    : "justify-start px-3 gap-3"
                )}
                tooltip={isCollapsed ? "Documentation" : undefined}
              >
                <BookOpen className="size-4 text-slate-500 dark:text-zinc-400 shrink-0" />
                {!isCollapsed && <span className="text-sm">Documentation</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem
              onClick={() => {
                setSettingsOpen(true)
                handleMobileClick()
              }}
            >
              <SidebarMenuButton
                className={cn(
                  "w-full h-10 rounded-xl hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors text-slate-900 dark:text-white",
                  isCollapsed
                    ? "justify-center px-0 w-10 mx-auto"
                    : "justify-start px-3 gap-3"
                )}
                tooltip={isCollapsed ? "Settings" : undefined}
              >
                <Settings2 className="size-4 text-slate-500 dark:text-zinc-400 shrink-0" />
                {!isCollapsed && <span className="text-sm">Settings</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {!isCollapsed && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Recent Notes
            </SidebarGroupLabel>
            <SidebarMenu className="px-3">
              {isLoading && <Skeleton className="w-full h-10 rounded-xl" />}
              {!isLoading && chatRooms.map((room) => (
                <SidebarMenuItem key={room.id} onClick={() => router.push(`/dashboard/c/${room.id}`)}>
                  <SidebarMenuButton className="w-full group/item py-2.5 px-3 h-auto rounded-xl hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors text-slate-900 dark:text-white">
                    <div className="flex flex-col gap-0.5 flex-1 overflow-hidden min-w-0">
                      <span className="truncate text-sm font-medium text-slate-900 dark:text-white">{room.title ?? "New Chat"}</span>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400">{formatDate(room.updatedAt)}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className={cn(
        "border-t border-border/50 relative z-10",
        isCollapsed ? "p-2" : "p-3"
      )}>
        <SidebarMenu>
          <SidebarMenuItem>
            {mounted ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className={cn(
                      "w-full hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors rounded-xl",
                      isCollapsed
                        ? "justify-center px-0 py-2 w-10 mx-auto"
                        : "justify-start px-3 py-2"
                    )}
                    onClick={handleMobileClick}
                  >
                    <Avatar className={cn(
                      "rounded-lg shrink-0",
                      isCollapsed ? "size-9" : "size-8"
                    )}>
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback className="rounded-lg bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <div className="grid flex-1 text-left text-sm leading-tight ml-3 min-w-0">
                        <span className="truncate font-medium text-slate-900 dark:text-white">{user?.name || "User"}</span>
                        <span className="truncate text-xs text-slate-500 dark:text-zinc-400">{user?.email || ""}</span>
                      </div>
                    )}
                    {!isCollapsed && <MoreHorizontal className="ml-auto size-4 text-slate-500 dark:text-zinc-400 shrink-0" />}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-2">
                      <User className="size-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <CreditCard className="size-4" /> Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Settings2 className="size-4" /> Preferences
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Fallback during SSR to prevent hydration mismatch
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "w-full hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors rounded-xl",
                  isCollapsed
                    ? "justify-center px-0 py-2 w-10 mx-auto"
                    : "justify-start px-3 py-2"
                )}
              >
                <Avatar className={cn(
                  "rounded-lg shrink-0",
                  isCollapsed ? "size-9" : "size-8"
                )}>
                  <AvatarFallback className="rounded-lg bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-white">U</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="grid flex-1 text-left text-sm leading-tight ml-3 min-w-0">
                    <span className="truncate font-medium text-slate-900 dark:text-white">User</span>
                    <span className="truncate text-xs text-slate-500 dark:text-zinc-400"></span>
                  </div>
                )}
                {!isCollapsed && <MoreHorizontal className="ml-auto size-4 text-slate-500 dark:text-zinc-400 shrink-0" />}
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <DocsDialog open={docsOpen} onOpenChange={setDocsOpen} />
    </Sidebar>
  )
}
