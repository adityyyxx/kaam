"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Bot, Cpu, Zap, Shield, Sparkles } from "lucide-react"

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <div className="flex flex-col h-[500px]">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Settings
            </DialogTitle>
            <DialogDescription>Configure your AI models and application preferences.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="model" className="flex-1 flex flex-col">
            <div className="px-6 border-b border-border/40">
              <TabsList className="w-full justify-start h-12 bg-transparent rounded-none p-0 gap-4">
                <TabsTrigger value="model" className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                  <Bot className="size-4" /> Model
                </TabsTrigger>
                <TabsTrigger value="general" className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                  <Cpu className="size-4" /> General
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                  <Shield className="size-4" /> Security
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <TabsContent
                value="model"
                className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Base Model</Label>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                      Recommended
                    </span>
                  </div>
                  <RadioGroup defaultValue="quantum-1" className="grid grid-cols-2 gap-3">
                    <Label className="flex flex-col gap-2 p-4 rounded-xl border-2 border-muted hover:border-primary/20 transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <div className="flex items-center justify-between">
                        <RadioGroupItem value="quantum-1" id="q1" className="sr-only" />
                        <div className="flex items-center gap-2">
                          <Zap className="size-4 text-primary" />
                          <span className="font-bold">Quantum-1</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Fastest response time, optimized for daily notes.
                      </p>
                    </Label>
                    <Label className="flex flex-col gap-2 p-4 rounded-xl border-2 border-muted hover:border-primary/20 transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <div className="flex items-center justify-between">
                        <RadioGroupItem value="genesis-pro" id="gp" className="sr-only" />
                        <div className="flex items-center gap-2">
                          <Cpu className="size-4 text-primary" />
                          <span className="font-bold">Genesis Pro</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Advanced reasoning, best for complex documents.
                      </p>
                    </Label>
                  </RadioGroup>
                </section>

                <Separator className="opacity-40" />

                <section className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Creativity (Temperature)</Label>
                      <span className="text-xs font-mono text-muted-foreground">0.7</span>
                    </div>
                    <Slider defaultValue={[70]} max={100} step={1} className="w-full" />
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Higher values lead to more creative but potentially less factual output.
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold">Web Browsing</Label>
                      <p className="text-[11px] text-muted-foreground">
                        Allow the model to access the internet for real-time info.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </section>
              </TabsContent>

              <TabsContent
                value="general"
                className="m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">Dark Mode</Label>
                    <p className="text-[11px] text-muted-foreground">Sync with system or choose a custom theme.</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">Auto-save Notes</Label>
                    <p className="text-[11px] text-muted-foreground">Automatically save drafts while chatting.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
