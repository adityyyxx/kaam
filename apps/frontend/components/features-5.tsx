"use client";

import { Globe, Sparkles, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function Features5() {
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
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const,
            },
        },
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut" as const,
            },
        },
    };

    return (
        <section className="py-24 md:py-[96px] relative z-10">
            <div className="mx-auto max-w-5xl md:max-w-6xl px-6">
                <motion.div
                    className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div className="lg:col-span-2" variants={itemVariants}>
                        <div className="md:pr-6 lg:pr-0">
                            <h2 className="text-4xl font-semibold lg:text-5xl tracking-tight mb-6">
                                Built for{" "}
                                <span className="text-red-500">Global Teams</span>
                            </h2>
                            <p className="text-lg text-primary/60 leading-relaxed">
                                Empower your team with powerful multilingual note-taking capabilities. 
                                Create, collaborate, and translate notes seamlessly across any language barrier.
                            </p>
                        </div>
                        <motion.ul
                            className="mt-8 divide-y divide-border border-y border-border *:flex *:items-center *:gap-3 *:py-4"
                            variants={itemVariants}
                        >
                            <motion.li variants={itemVariants}>
                                <Globe className="size-5 text-red-500 shrink-0" />
                                <span className="text-primary">Multi-language support</span>
                            </motion.li>
                            <motion.li variants={itemVariants}>
                                <Zap className="size-5 text-red-500 shrink-0" />
                                <span className="text-primary">AI-powered translation</span>
                            </motion.li>
                            <motion.li variants={itemVariants}>
                                <Sparkles className="size-5 text-red-500 shrink-0" />
                                <span className="text-primary">Smart note generation</span>
                            </motion.li>
                            <motion.li variants={itemVariants}>
                                <Shield className="size-5 text-red-500 shrink-0" />
                                <span className="text-primary">Secure collaboration</span>
                            </motion.li>
                        </motion.ul>
                    </motion.div>
                    <motion.div
                        className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3 bg-background/50 backdrop-blur-sm"
                        variants={imageVariants}
                    >
                        <div className="bg-gradient-to-b aspect-76/59 relative rounded-2xl from-zinc-200 to-transparent dark:from-zinc-800 p-px overflow-hidden">
                            <div className="w-full h-full rounded-[15px] bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
                                        <Sparkles className="size-4 text-red-500" />
                                        <span className="text-sm font-medium text-red-500">AI-Powered</span>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-primary mb-2">
                                        Multilingual Notes
                                    </h3>
                                    <p className="text-primary/60 text-sm max-w-xs mx-auto">
                                        Create notes in any language and translate them instantly with AI-powered technology
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
