"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Target, Heart, Mail, MapPin, Send } from "lucide-react";

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
    buttonText: "Generate Notes",
    href: "/signin",
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

        {/* About */}
        <motion.section
          id="about"
          className="py-24 md:py-[96px] relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                About{" "}
                <span className="text-red-500">Notebook.io</span>
              </h2>
              <p className="text-lg md:text-xl text-primary/60 max-w-3xl mx-auto">
                We&apos;re on a mission to break language barriers in knowledge sharing.
                Our AI-powered platform helps people create, organize, and translate
                notes effortlessly across any language.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {[
                { value: "100+", label: "Languages Supported" },
                { value: "50K+", label: "Notes Generated" },
                { value: "10K+", label: "Happy Users" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-6 rounded-2xl bg-background/50 border border-border/50 backdrop-blur-sm"
                >
                  <p className="text-3xl md:text-4xl font-bold text-red-500 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-primary/60">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Values */}
            <motion.div
              className="grid md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              {[
                {
                  icon: Users,
                  title: "Community First",
                  description:
                    "Built by a passionate community of developers and linguists dedicated to making knowledge accessible to everyone.",
                },
                {
                  icon: Target,
                  title: "Precision & Quality",
                  description:
                    "Our AI models are fine-tuned for context-aware translations that preserve meaning, tone, and nuance across languages.",
                },
                {
                  icon: Heart,
                  title: "Open & Inclusive",
                  description:
                    "We believe information should flow freely. Our platform supports diverse languages and accessibility needs.",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm group hover:border-red-500/30 transition-colors duration-300"
                >
                  <value.icon className="size-8 text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-primary/60 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          id="contact"
          className="py-24 md:py-[96px] relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                Get in{" "}
                <span className="text-red-500">Touch</span>
              </h2>
              <p className="text-lg md:text-xl text-primary/60 max-w-2xl mx-auto">
                Have questions or feedback? We&apos;d love to hear from you.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm">
                  <Mail className="size-6 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-primary/60 text-sm">adityatiwarii.x@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm">
                  <MapPin className="size-6 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-primary/60 text-sm">New Delhi, India</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm">
                  <h3 className="font-semibold mb-3">Follow Us</h3>
                  <div className="flex gap-3">
                    {["Twitter", "GitHub", "Discord"].map((platform) => (
                      <a
                        key={platform}
                        href="#"
                        className="px-4 py-2 rounded-full text-sm border border-border/50 text-primary/60 hover:text-red-500 hover:border-red-500/30 transition-colors duration-200"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <ContactForm />
            </div>
          </div>
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
    </div >
  );
}



function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:adityatiwarii.x@gmail.com?subject=Message from ${encodeURIComponent(name)} (${encodeURIComponent(email)})&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 5000);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-primary placeholder:text-primary/40 focus:outline-none focus:border-red-500/50 transition-colors";

  if (sent) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center gap-4 py-16"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="size-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
          <svg className="size-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-primary">Message Sent Successfully!</h3>
        <p className="text-primary/60 text-sm text-center max-w-xs">
          Thank you for reaching out. We&apos;ll get back to you soon.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      className="space-y-4"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      onSubmit={handleSubmit}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <textarea
        placeholder="Your message..."
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className={`${inputClass} resize-none`}
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200"
      >
        <Send className="size-4" />
        Send Message
      </button>
    </motion.form>
  );
}
