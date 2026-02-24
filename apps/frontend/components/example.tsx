"use client"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, FileText, Layout, Zap, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function DocsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <DialogTitle className="sr-only">Documentation</DialogTitle>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r border-border/40 bg-muted/20 flex flex-col">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm px-2">
                <BookOpen className="size-4 text-primary" />
                Documentation
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                <Input className="h-8 pl-8 text-xs bg-background/50" placeholder="Search docs..." />
              </div>
            </div>
            <ScrollArea className="flex-1 px-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="getting-started" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-2 px-2 rounded-lg hover:bg-muted/50 text-xs font-semibold">
                    Getting Started
                  </AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <div className="flex flex-col gap-1 pl-4 mt-1">
                      <button className="text-[11px] text-left py-1.5 px-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        Introduction
                      </button>
                      <button className="text-[11px] text-left py-1.5 px-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        Basic Commands
                      </button>
                      <button className="text-[11px] text-left py-1.5 px-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        Pro Tips
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="features" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-2 px-2 rounded-lg hover:bg-muted/50 text-xs font-semibold">
                    Core Features
                  </AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <div className="flex flex-col gap-1 pl-4 mt-1">
                      <button className="text-[11px] text-left py-1.5 px-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        Chat Interface
                      </button>
                      <button className="text-[11px] text-left py-1.5 px-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        Note Generation
                      </button>
                      <button className="text-[11px] text-left py-1.5 px-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        Templates
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-background">
            <ScrollArea className="flex-1">
              <div className="p-10 max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider">
                    v1.4.0 • New
                  </div>
                  <h1 className="text-4xl font-black tracking-tight">Introduction to Notebook.io</h1>
                  <p className="text-muted-foreground leading-relaxed">
                    Learn how to leverage AI to transform your chaotic thoughts into structured, beautiful notes.
                    Notebook.io is designed for speed and clarity.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-all cursor-pointer group">
                    <CardContent className="p-5 space-y-3">
                      <Zap className="size-5 text-primary" />
                      <h3 className="font-bold text-sm">Quick Setup</h3>
                      <p className="text-[11px] text-muted-foreground leading-normal">
                        Connect your account and start generating in 60 seconds.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-all cursor-pointer group">
                    <CardContent className="p-5 space-y-3">
                      <Layout className="size-5 text-primary" />
                      <h3 className="font-bold text-sm">Workspaces</h3>
                      <p className="text-[11px] text-muted-foreground leading-normal">
                        Organize your notes into thematic workspaces and folders.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our AI models are trained specifically on professional writing styles and technical documentation.
                    When you chat with the model, it doesn't just respond—it understands context and intent.
                  </p>
                  <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex gap-4">
                    <FileText className="size-5 text-primary shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold">Smart Templates</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Use the{" "}
                        <code className="text-[10px] bg-background px-1.5 py-0.5 rounded border">/template</code>{" "}
                        command to browse available structural layouts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
