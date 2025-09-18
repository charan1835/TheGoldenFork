"use client";

import React from "react";
import PrismBackground from "./animations/PrismBackground";
import Shuffle from "./Shuffle";
import ElectricButton from "./animations/ElectricButton";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative">
      <PrismBackground className="overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Fresh, Fast, and {" "}
              <Shuffle
                text="Seriously Tasty"
                shuffleDirection="right"
                duration={0.10}
                animationMode="evenodd"
                shuffleTimes={10}
                ease="easeOut"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                triggerOnHover={true}
                respectReducedMotion={true}
                className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              />
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Order from a live, local kitchen. Real chefs. Real-time prep. Delivered
              hot and delicious.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
              <Link href="#home" className="group">
                <ElectricButton className="bg-foreground/90">
                  Browse Menu
                </ElectricButton>
              </Link>
              <Link href="/connect" className="group">
                <button className="inline-flex items-center justify-center rounded-lg border border-border/70 bg-surface px-5 py-2.5 font-semibold text-foreground/90 shadow-soft transition hover:shadow-elevated">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </PrismBackground>
    </section>
  );
}


