"use client";

import type { ComponentProps } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";

import { Hero, DashedGridBackground } from "@/components/ui/home-section";
import { Features } from "@/components/features-10";
import { Features5 } from "@/components/features-5";
import { Pricing } from "@/components/pricing";
import { Component as FlickeringFooter } from "@/components/flickering-footer";
import { Header } from "@/components/header-2";
import { renderCanvas } from "@/components/ui/hero-designali";

type PricingComponentProps = ComponentProps<typeof Pricing>;

const pricingPlans: PricingComponentProps["plans"] = [
  {
    name: "Starter",
    price: "9",
    yearlyPrice: "7",
    period: "month",
    features: [
      "Up to 3 workspaces",
      "Basic multilingual note generation",
      "Email support",
    ],
    description:
      "Perfect for individuals getting started with multilingual notes.",
    buttonText: "Get Started",
    href: "#",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "19",
    yearlyPrice: "15",
    period: "month",
    features: [
      "Unlimited workspaces",
      "Priority AI generation queue",
      "Collaboration tools",
      "Priority support",
    ],
    description: "Best for teams that rely on structured notes every day.",
    buttonText: "Upgrade to Pro",
    href: "#",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "49",
    yearlyPrice: "39",
    period: "month",
    features: [
      "Custom onboarding",
      "Dedicated account manager",
      "Advanced security controls",
      "SLA-backed uptime",
    ],
    description:
      "Designed for organizations with advanced compliance needs.",
    buttonText: "Contact Sales",
    href: "#",
    isPopular: false,
  },
];

export function LandingPage() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans dark:bg-black relative">
      <DashedGridBackground />
      <Header />
      <canvas
        className="pointer-events-none fixed inset-0 mx-auto z-[5]"
        id="canvas"
      ></canvas>
      <main className="flex-1 overflow-hidden relative z-10">
        {/* Hero */}
        <section className="pt-4 md:pt-8 pb-24">
          <Hero />
        </section>

        {/* Features */}
        <section id="features" className="py-24 md:py-[96px] relative z-10">
          <Features />
        </section>

        {/* Features 5 - Additional Features */}
        <motion.section
          className="py-24 md:py-[96px] relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Features5 />
        </motion.section>

        {/* Pricing */}
        <motion.section
          id="pricing"
          className="py-24 md:py-[96px] relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <Pricing plans={pricingPlans} />
          </div>
        </motion.section>

        {/* Flickering Footer */}
        <motion.section
          className="mt-24 md:mt-[120px] relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="max-w-5xl mx-auto px-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                Ready to Transform Your{" "}
                <span className="text-red-500">Note-Taking</span>?
              </h2>
              <p className="text-2xl md:text-2xl text-primary/60 max-w-3xl mx-auto mb-4">
                Start creating multilingual notes with{" "}
                <span className="text-red-500 font-bold">AI-powered generation</span> today.
              </p>
              <p className="text-primary/60 max-w-2xl mx-auto">
                Join thousands of users who are already creating structured, multilingual notes with ease.
              </p>
            </div>
          </motion.div>
          <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <FlickeringFooter />
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}



