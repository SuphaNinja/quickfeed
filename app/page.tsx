"use client"

import Container from "@/components/layout/container/Container";
import AiShowcase from "@/components/landing/ai-showcase/AiShowcase";
import Faq from "@/components/landing/faq/Faq";
import FlippableCards from "@/components/landing/flippable-cards/FlippableCards";
import Hero from "@/components/landing/hero/Hero";
import KeyFeatures from "@/components/landing/key-features/KeyFeatures";
import Pricing from "@/components/landing/pricing/Pricing";
import WidgetShowcase from "@/components/landing/widget-showcase/WidgetShowcase";
import Footer from "@/components/layout/footer/Footer";
import NavBar from "@/components/layout/navbar/navbar";

export default function Home() {
  return (
    <main>
      <Container>
        <NavBar />
        <Hero />
        <KeyFeatures />
        <WidgetShowcase />
        <AiShowcase />
        <FlippableCards />
        <Pricing />
        <Faq />
      </Container>
      <Footer />
    </main>
  );
}
