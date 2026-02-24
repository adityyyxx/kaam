"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Section = {
    id: string
    heading: string
    content: string
    status: "pending" | "streaming" | "done"
}

type Props = {
    title: string
    sections: Section[]
    progress: string
}

type NotesStreamEvent =
    | {
        type: "meta"
        title: string
        sections: string[]
    }
    | {
        type: "section_start"
        sectionId: string
        heading: string
    }
    | {
        type: "section_chunk"
        sectionId: string
        content: string
    }
    | {
        type: "section_end"
        sectionId: string
    }
    | {
        type: "complete"
    }

type NotesSection = {
    id: string
    heading: string
    content: string
    status: "pending" | "streaming" | "done"
}

type NotesDocument = {
    title: string
    sections: NotesSection[]
}

// function handleNotesStream(event: NotesStreamEvent) {
//     switch (event.type) {
//       case "meta":
//         setDoc({
//           title: event.title,
//           sections: event.sections.map(s => ({
//             id: s,
//             heading: s,
//             content: "",
//             status: "pending"
//           }))
//         })
//         break
  
//       case "section_start":
//         updateSection(event.sectionId, {
//           status: "streaming"
//         })
//         break
  
//       case "section_chunk":
//         updateSection(event.sectionId, prev => ({
//           content: prev.content + event.content
//         }))
//         break
  
//       case "section_end":
//         updateSection(event.sectionId, {
//           status: "done"
//         })
//         break
//     }
//   }
  


export function NotesCanvas({ title, sections, progress }: Props) {
    return (
        <div className="flex h-full w-full justify-center overflow-y-auto bg-muted/30 px-6 py-10">
            <div className="w-full max-w-3xl space-y-8">

                {/* Header */}
                <div className="space-y-1">
                    <Badge variant="secondary">📝 Notes Mode</Badge>
                    <p className="text-xs text-muted-foreground">{progress}</p>
                </div>

                {/* Document */}
                <Card className="p-8 shadow-sm">
                    <h1 className="mb-6 text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>

                    <div className="space-y-6">
                        {sections.map((section) => (
                            <div key={section.id} className="space-y-2">
                                <h2 className="text-lg font-medium">
                                    {section.heading}
                                </h2>

                                <p
                                    className={cn(
                                        "whitespace-pre-wrap leading-relaxed transition-colors",
                                        section.status === "pending" &&
                                        "text-muted-foreground italic",
                                        section.status === "streaming" &&
                                        "text-foreground",
                                        section.status === "done" &&
                                        "text-foreground"
                                    )}
                                >
                                    {section.content || "Generating…"}
                                    {section.status === "streaming" && (
                                        <span className="ml-1 animate-pulse">▋</span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
