import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { NotesSidebar } from "@/components/notes-sidebar"
import { ChatInterface } from "@/components/chat-interface"

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ chatRoomId: string }>
}) {
  const chatParams = await params;
  console.log("Chat Room ID: ", chatParams.chatRoomId);
  return (
    <SidebarProvider>
      <div className="flex h-[100dvh] w-full overflow-hidden bg-zinc-50 dark:bg-black font-sans">
        <NotesSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden h-full">
          <main className="flex-1 overflow-hidden relative h-full">
            <ChatInterface chatRoomId={chatParams} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
