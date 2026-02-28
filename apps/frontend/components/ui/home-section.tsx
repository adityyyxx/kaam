"use client";

import Link from "next/link";
import { ShineBorder, TypeWriter } from "@/components/ui/hero-designali";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const Hero = () => {
  const router = useRouter();

  const noteTypes = [
    "Study Notes",
    "Language Learning",
    "Educational Content",
    "Research Notes",
    "Multilingual Content",
    "Course Materials",
    "Academic Notes",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="home" className="relative">
      <div className="absolute inset-0 max-md:hidden top-[100px] z-0 h-[400px] w-full bg-transparent  bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#a8a29e_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e_1px,transparent_1px)]"></div>
      <motion.div
        className="flex flex-col items-center justify-center px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20" variants={itemVariants}>
          <div className="relative flex items-center rounded-full border bg-popover px-3 py-1 text-xs text-primary/60">
            Introducing Multilingual Notes Generator.
            <Link
              href="#features"
              rel="noreferrer"
              className="ml-1 flex items-center font-semibold"
            >
              <div
                className="absolute inset-0 hover:font-semibold hover:text-primary flex"
                aria-hidden="true"
              />
              Explore <span aria-hidden="true"></span>
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <motion.div
            className="border-text-red-500 relative mx-auto h-full bg-background border py-12 p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)]"
            variants={headlineVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="flex flex-col text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-7xl">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <Plus
                  strokeWidth={4}
                  className="text-text-red-500 absolute -left-5 -top-5 h-10 w-10"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <Plus
                  strokeWidth={4}
                  className="text-text-red-500 absolute -bottom-5 -left-5 h-10 w-10"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <Plus
                  strokeWidth={4}
                  className="text-text-red-500 absolute -right-5 -top-5 h-10 w-10"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <Plus
                  strokeWidth={4}
                  className="text-text-red-500 absolute -bottom-5 -right-5 h-10 w-10"
                />
              </motion.div>
              <span>
                Your complete platform for{" "}
                <span className="text-red-500">Multilingual Notes.</span>
              </span>
            </h1>
            <motion.div
              className="flex items-center mt-4 justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <p className="text-xs text-green-500">Available Now</p>
            </motion.div>
          </motion.div>

          <motion.h1
            className="mt-8 text-2xl md:text-2xl"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Generate AI-powered structured notes and translate them to{" "}
            <span className="text-red-500 font-bold">any language</span>
          </motion.h1>

          <motion.p
            className="text-primary/60 py-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Create high-quality structured notes with AI, then instantly translate them into multiple languages using Lingo.dev.
            Perfect for{" "}
            <span className="text-blue-500 font-semibold">
              <TypeWriter strings={noteTypes} />
            </span>.
          </motion.p>

        </div>
      </motion.div>
    </section>
  );
};

// Background component to be used across the landing page
export const DashedGridBackground = () => (
  <div
    className="fixed inset-0 z-0 pointer-events-none"
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
);
