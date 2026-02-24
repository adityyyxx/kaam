import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Languages, Sparkles, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function Features() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const,
            },
        },
    };

    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                {/* Section Heading */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                        Powerful Features for{" "}
                        <span className="text-red-500">Multilingual Notes</span>
                    </h2>
                    <p className="text-2xl md:text-2xl text-primary/60 max-w-3xl mx-auto">
                        Everything you need to create, organize, and translate your notes across{" "}
                        <span className="text-red-500 font-bold">any language</span>
                    </p>
                    <p className="text-primary/60 py-4 max-w-2xl mx-auto">
                        Transform your note-taking workflow with AI-powered generation and seamless multilingual translation.
                    </p>
                </motion.div>

                <motion.div
                    className="mx-auto grid gap-4 lg:grid-cols-2"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <motion.div variants={itemVariants}>
                        <FeatureCard>
                            <CardHeader className="pb-3">
                                <CardHeading
                                    icon={Sparkles}
                                    title="AI-Powered Generation"
                                    description="Generate structured, high-quality notes instantly with advanced AI technology."
                                />
                            </CardHeader>

                            <div className="relative mb-6 border-t border-dashed sm:mb-0">
                                <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,hsl(var(--muted)),white_125%)]"></div>
                                <div className="aspect-[76/59] p-1 px-6">
                                    <DualModeImage
                                        darkSrc="https://tailark.com/_next/image?url=%2Fpayments.png&w=3840&q=75"
                                        lightSrc="https://tailark.com/_next/image?url=%2Fpayments-light.png&w=3840&q=75"
                                        alt="AI note generation illustration"
                                        width={1207}
                                        height={929}
                                    />
                                </div>
                            </div>
                        </FeatureCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <FeatureCard>
                            <CardHeader className="pb-3">
                                <CardHeading
                                    icon={Languages}
                                    title="Multi-Language Translation"
                                    description="Translate your notes to over 100 languages with perfect context preservation."
                                />
                            </CardHeader>

                            <CardContent>
                                <div className="relative mb-6 sm:mb-0">
                                    <div className="absolute -inset-6 [background:radial-gradient(50%_50%_at_75%_50%,transparent,hsl(var(--background))_100%)]"></div>
                                    <div className="aspect-[76/59] border">
                                        <DualModeImage
                                            darkSrc="https://tailark.com/_next/image?url=%2Forigin-cal-dark.png&w=3840&q=75"
                                            lightSrc="https://tailark.com/_next/image?url=%2Forigin-cal.png&w=3840&q=75"
                                            alt="translation illustration"
                                            width={1207}
                                            height={929}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </FeatureCard>
                    </motion.div>

                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <FeatureCard className="p-6 lg:col-span-2">
                            <p className="mx-auto my-6 max-w-md text-balance text-center text-2xl font-semibold">
                                Organize notes across multiple languages with smart categorization.
                            </p>

                            <div className="flex justify-center gap-6 overflow-hidden">
                                <CircularUI
                                    label="English"
                                    circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                                />

                                <CircularUI
                                    label="Spanish"
                                    circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                                />

                                <CircularUI
                                    label="French"
                                    circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                                />

                                <CircularUI
                                    label="German"
                                    circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                                    className="hidden sm:block"
                                />
                            </div>
                        </FeatureCard>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <Card className={cn('group relative rounded-none shadow-zinc-950/5', className)}>
        <CardDecorator />
        {children}
    </Card>
)

const CardDecorator = () => (
    <>
        <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
        <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
        <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
        <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <span className="text-muted-foreground flex items-center gap-2">
            <Icon className="size-4 text-red-500" />
            {title}
        </span>
        <p className="mt-8 text-2xl font-semibold">{description}</p>
    </div>
)

interface DualModeImageProps {
    darkSrc: string
    lightSrc: string
    alt: string
    width: number
    height: number
    className?: string
}

const DualModeImage = ({ darkSrc, lightSrc, alt, width, height, className }: DualModeImageProps) => (
    <>
        <img
            src={darkSrc}
            className={cn('hidden dark:block', className)}
            alt={`${alt} dark`}
            width={width}
            height={height}
        />
        <img
            src={lightSrc}
            className={cn('shadow dark:hidden', className)}
            alt={`${alt} light`}
            width={width}
            height={height}
        />
    </>
)

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-gradient-to-b from-border size-fit rounded-2xl to-transparent p-px">
            <div className="bg-gradient-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-primary': circle.pattern === 'none',
                            'border-primary bg-[repeating-linear-gradient(-45deg,hsl(var(--border)),hsl(var(--border))_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
                            'border-primary bg-background bg-[repeating-linear-gradient(-45deg,hsl(var(--primary)),hsl(var(--primary))_1px,transparent_1px,transparent_4px)]': circle.pattern === 'primary',
                            'bg-background z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,theme(colors.blue.500),theme(colors.blue.500)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'blue',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-muted-foreground mt-1.5 block text-center text-sm">{label}</span>
    </div>
)
