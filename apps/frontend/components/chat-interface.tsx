"use client"

import * as React from "react"
import { InputGroup, InputGroupAddon, InputGroupTextarea } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Paperclip, ArrowUpCircle, Share2, Loader2, Upload, FileText, Sparkles, MessageSquare, X } from "lucide-react"
import { Reasoning, ReasoningTrigger } from "@/components/ai-elements/reasoning"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import type { MessageBlocks } from "@/lib/message-blocks"
import { BlockRenderer } from "@/components/message-blocks/block-renderer"
import { responseToBlocks } from "@/lib/response-to-blocks"

interface Message {
  role: "user" | "assistant"
  content: string  // Keep for backward compatibility
  blocks?: MessageBlocks  // Structured format for rendering
  createdAt?: string | Date
}

interface ChatRoomIdParam {
  chatRoomId: string;
}

interface ChatInterfaceProps {
  chatRoomId?: ChatRoomIdParam;
}

const initialMessages: Message[] = []

export function ChatInterface({ chatRoomId }: ChatInterfaceProps) {
  const [messages, setMessages] = React.useState(initialMessages)
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false)
  const [popoverOpen, setPopoverOpen] = React.useState(false)
  const [selectedAction, setSelectedAction] = React.useState<"upload" | "generateNotes" | "chatTheory" | null>(null)
  const [selectedFileName, setSelectedFileName] = React.useState<string | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Ensure component is mounted before rendering Radix UI components to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const formatTimestamp = (date?: string | Date): string => {
    if (!date) return "Just now"

    // Convert string to Date if needed
    const messageDate = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000)

    // Handle future dates (shouldn't happen, but just in case)
    if (diffInSeconds < 0) return "Just now"

    // Less than a minute
    if (diffInSeconds < 60) {
      return "Just now"
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`
    }

    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return hours === 1 ? "an hour ago" : `${hours} hours ago`
    }

    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return days === 1 ? "a day ago" : `${days} days ago`
    }

    // Less than a month
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800)
      return weeks === 1 ? "a week ago" : `${weeks} weeks ago`
    }

    // Less than a year
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return months === 1 ? "a month ago" : `${months} months ago`
    }

    // More than a year
    const years = Math.floor(diffInSeconds / 31536000)
    return years === 1 ? "a year ago" : `${years} years ago`
  }

  const loadMessages = React.useCallback(async () => {
    if (!chatRoomId) return;
    setIsLoadingMessages(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to load messages');
        return;
      }
      const resp = await fetch(`/api/v1/chat/${chatRoomId.chatRoomId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `${token}`
        }
      })
      if (resp.ok) {
        const data = await resp.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map((msg: { role: Message["role"]; content: string; createdAt?: string }) => {
            // Parse blocks for assistant messages
            const blocks = msg.role === "assistant" ? responseToBlocks(msg.content) : undefined;
            return {
              role: msg.role,
              content: msg.content,
              blocks: blocks,
              createdAt: msg.createdAt
            }
          }))
        } else {
          setMessages(initialMessages)
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [chatRoomId])

  React.useEffect(() => {
    if (chatRoomId) {
      loadMessages();
    }
    else {
      setMessages(initialMessages);
    }
  }, [chatRoomId, loadMessages])

  const handleActionSelect = (action: "upload" | "generateNotes" | "chatTheory") => {
    setSelectedAction(action)
    setPopoverOpen(false)

    if (action === "upload") {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFileName(file.name)
    setSelectedAction("upload")

    // Placeholder hook for actual upload integration
    toast.success(`Selected file: ${file.name}`)
  }

  const handleSend = async () => {
    if (!input.trim() || !chatRoomId || isLoading) return

    const userMessage: Message = { role: "user", content: input, createdAt: new Date() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to send messages');
        setIsLoading(false);
        return;
      }
      const resp = await fetch(`/api/v1/chat/${chatRoomId.chatRoomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `${token}`
        },
        body: JSON.stringify({ content: userMessage.content })
      })
      if (!resp.ok) {
        toast.error('Failed to send message')
        setIsLoading(false)
        // Remove the user message on error
        setMessages(messages)
        return
      }

      const reader = resp.body?.getReader()
      if (!reader) {
        setIsLoading(false)
        return
      }
      const decoder = new TextDecoder()

      let assistantMessage = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const token = line.slice(6)
            if (!token) continue

            assistantMessage += token

            // Parse blocks for streaming messages
            const blocks = responseToBlocks(assistantMessage);
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content: assistantMessage,
                blocks: blocks,
                createdAt: new Date()
              }
            ])
          }
        }
      }

      // After streaming completes, parse final blocks
      const finalBlocks = responseToBlocks(assistantMessage);

      // Update the last message with parsed blocks
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
          updated[lastIndex] = {
            ...updated[lastIndex],
            blocks: finalBlocks
          };
        }
        return updated;
      });

      setIsLoading(false)
    } catch (error) {
      console.error('Send message error:', error)
      toast.error('An unexpected error occurred')
      // Remove the user message on error
      setMessages(messages)
      setIsLoading(false)
    }

  }

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (isLoadingMessages) {
    return (
      <div className="flex flex-col h-full bg-zinc-50 dark:bg-black items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-2">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-black relative custom-scrollbar-container">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b bg-zinc-50/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-20 border-border/40">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <img
              src="/vercel.svg"
              alt="Notebook.io Logo"
              className="h-6 w-6 object-contain"
            />
            <h1 className="text-sm font-bold tracking-tight">Notebook.io</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 px-3 rounded-full text-xs font-medium border-border/60 bg-transparent"
          >
            <Share2 className="size-3.5" />
            <span>Share Chat</span>
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6 w-full pb-32 scroll-smooth">
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-6 py-12 text-center text-muted-foreground">
              <div className="flex items-center justify-center size-12 rounded-full bg-muted/60 text-foreground border border-border/60 overflow-hidden">
                <img
                  src="/vercel.svg"
                  alt="Notebook.io Logo"
                  className="size-8 object-contain"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Welcome back</h2>
                <p className="text-sm text-muted-foreground">
                  Start a conversation or try a prompt below.
                </p>
              </div>
              <div className="grid w-full gap-3 md:grid-cols-2">
                {[
                  "Generate JEE Main notes on Thermodynamics",
                  "Create notes for Class 10 Board Exam - History",
                  "Make NEET Biology notes on Human Physiology",
                  "Generate notes on Organic Chemistry for JEE Advanced"
                ].map((prompt) => (
                  <button
                    key={prompt}
                    className="w-full rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-left text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setInput(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-4 mb-8 last:mb-0",
                "animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div className={cn(
                "flex flex-col gap-2",
                msg.role === "user" ? "items-end max-w-[85%]" : "items-start w-full"
              )}>
                {msg.role === "assistant" && msg.blocks ? (
                  // Render structured blocks for assistant messages - ChatGPT style (no bubble)
                  <div className="w-full max-w-[720px] text-foreground">
                    <BlockRenderer blocks={msg.blocks} />
                  </div>
                ) : msg.role === "assistant" ? (
                  // Plain text assistant message - ChatGPT style (no bubble)
                  <div className="w-full max-w-[720px] text-foreground leading-[1.75]">
                    <p className="mb-0 whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                ) : (
                  // User message - keep bubble style
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                      "bg-primary text-primary-foreground rounded-tr-none",
                      "transition-shadow hover:shadow-md",
                    )}
                  >
                    {msg.content}
                  </div>
                )}
                <span className="text-[10px] text-muted-foreground/60 px-1">
                  {msg.role === "assistant" ? "Notebook.io AI" : "You"} • {formatTimestamp(msg.createdAt)}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 mb-6 last:mb-0">
              <div className="flex flex-col gap-1 w-full items-start">
                <div className="w-full max-w-[720px] text-foreground">
                  <Reasoning isStreaming={isLoading} defaultOpen={true} className="mb-0">
                    <ReasoningTrigger />
                  </Reasoning>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-10 px-4 md:px-6">
        <div className="max-w-3xl mx-auto w-full">
          <InputGroup className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl focus-within:ring-2 focus-within:ring-primary/5 transition-all p-1.5 min-h-[56px] border">
            <InputGroupAddon align="inline-start" className="pl-3">
              {mounted ? (
                <DropdownMenu open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="size-8 rounded-xl text-muted-foreground hover:text-foreground"
                      aria-label="Open actions"
                    >
                      <Paperclip className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-60 p-2">
                    <DropdownMenuItem
                      className="gap-2 text-sm"
                      onClick={() => handleActionSelect("upload")}
                    >
                      <Upload className="size-4 text-muted-foreground" />
                      <span>Upload file or image</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 text-sm"
                      onClick={() => handleActionSelect("generateNotes")}
                    >
                      <FileText className="size-4 text-muted-foreground" />
                      <span>Generate Notes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 text-sm"
                      onClick={() => handleActionSelect("chatTheory")}
                    >
                      <MessageSquare className="size-4 text-muted-foreground" />
                      <span>Chat with your theory</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 rounded-xl text-muted-foreground hover:text-foreground"
                  aria-label="Open actions"
                  disabled
                >
                  <Paperclip className="size-4" />
                </Button>
              )}
            </InputGroupAddon>

            <InputGroupTextarea
              placeholder={chatRoomId ? "Message Notebook.io..." : "Create a new chat to start..."}
              className="text-sm py-3 px-2 max-h-32 bg-transparent border-none focus-visible:ring-0"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={!chatRoomId || isLoading}
            />

            <InputGroupAddon align="inline-end" className="pr-1.5 flex flex-col justify-end">
              <div className="flex items-center gap-2 pb-1 pr-1.5">
                <Kbd className="bg-muted/50 text-[10px] border-border/50 hidden md:flex">
                  <span>⌘</span>
                  <span>Enter</span>
                </Kbd>
                <Button
                  size="icon-sm"
                  className="size-9 rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all"
                  onClick={handleSend}
                  disabled={!input.trim() || !chatRoomId || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <ArrowUpCircle className="size-5" />
                  )}
                </Button>
              </div>
            </InputGroupAddon>
          </InputGroup>
          {selectedAction && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {selectedAction === "upload" && <Upload className="size-4" />}
                {selectedAction === "generateNotes" && <FileText className="size-4" />}
                {selectedAction === "chatTheory" && <Sparkles className="size-4" />}
                <span>
                  {selectedAction === "upload" && (selectedFileName ? `Ready to upload: ${selectedFileName}` : "Upload file or image")}
                  {selectedAction === "generateNotes" && "Generate notes from this chat"}
                  {selectedAction === "chatTheory" && "Chat with your theory enabled"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSelectedAction(null)
                  setSelectedFileName(null)
                }}
                aria-label="Dismiss action"
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
          <p className="text-[10px] text-center text-muted-foreground/60 mt-3 font-medium">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
