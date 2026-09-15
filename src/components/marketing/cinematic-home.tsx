"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const benefits = ["Made to feel personal", "Designed to be found", "Ready for every day"];

export function CinematicHome() {
  const [tagSide, setTagSide] = useState<"front" | "back">("front");
  const heroRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    const setDepth = (element: HTMLElement, event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      element.style.setProperty("--pointer-x", x.toFixed(3));
      element.style.setProperty("--pointer-y", y.toFixed(3));
    };

    const resetDepth = (element: HTMLElement) => {
      element.style.setProperty("--pointer-x", "0");
      element.style.setProperty("--pointer-y", "0");
    };

    const hero = heroRef.current;
    const tag = tagRef.current;
    if (!hero || !tag || prefersReducedMotion.matches || !finePointer.matches) return;

    const moveHero = (event: PointerEvent) => setDepth(hero, event);
    const moveTag = (event: PointerEvent) => setDepth(tag, event);
    const resetHero = () => resetDepth(hero);
    const resetTag = () => resetDepth(tag);
    hero.addEventListener("pointermove", moveHero);
    hero.addEventListener("pointerleave", resetHero);
    tag.addEventListener("pointermove", moveTag);
    tag.addEventListener("pointerleave", resetTag);
    return () => {
      hero.removeEventListener("pointermove", moveHero);
      hero.removeEventListener("pointerleave", resetHero);
      tag.removeEventListener("pointermove", moveTag);
      tag.removeEventListener("pointerleave", resetTag);
    };
  }, []);

  return (
    <main className="petbot-page">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Petbot home"><span className="wordmark-mark" aria-hidden="true">✦</span>petbot</a>
        <nav aria-label="Primary navigation"><a href="#story">Our story</a><a href="#tag">The tag</a><a href="#how-it-works">How it works</a></nav>
        <a className="header-cta" href="#tag">Explore tags <span aria-hidden="true">↗</span></a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title" ref={heroRef}>
        <div className="hero-media" aria-hidden="true">
          <Image src="/media/petbot-cinematic-world.png" alt="" fill priority sizes="100vw" className="hero-poster" />
          <video autoPlay muted loop playsInline poster="/media/petbot-cinematic-world.png"><source src="/media/petbot-hero-loop.mp4" type="video/mp4" /></video>
        </div>
        <div className="hero-wash" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow light"><span>New</span> A kinder way home</p>
          <h1 id="hero-title">More than a tag.<br /><em>A way back home.</em></h1>
          <p className="hero-copy">Thoughtfully made pet identity, designed to keep your favourite companion close—even when they wander.</p>
          <div className="hero-actions"><a className="button button-light" href="#tag">Meet the tag <span aria-hidden="true">↘</span></a><a className="text-link light" href="#story">Watch the story <span aria-hidden="true">↓</span></a></div>
        </div>
        <a className="scroll-cue" href="#story"><span /> Scroll to explore</a>
      </section>

      <section className="story-section" id="story" aria-labelledby="story-title">
        <div className="story-sticky"><p className="eyebrow">For the moments that matter</p><h2 id="story-title">A little more<br />peace of mind.</h2><p>Every Petbot tag connects a beautiful, everyday object with a simple digital identity—so the path back to you can start with one scan.</p></div>
        <ol className="story-steps"><li><span>01</span><strong>Wear</strong><p>A considered tag, personalised for them.</p></li><li><span>02</span><strong>Scan</strong><p>A finder can open their safe profile in seconds.</p></li><li><span>03</span><strong>Reconnect</strong><p>A small detail that helps bring them home.</p></li></ol>
      </section>

      <section className="product-section" id="tag" aria-labelledby="tag-title">
        <div className="product-intro"><p className="eyebrow">The Petbot tag</p><h2 id="tag-title">Beautifully personal.<br /><em>Quietly smart.</em></h2><p>A made-for-them keepsake in durable stainless steel, with a thoughtful connection on the reverse.</p><a className="button button-dark" href="#how-it-works">See how it works <span aria-hidden="true">→</span></a></div>
        <div className="tag-stage">
          <div ref={tagRef} className={`tag-card ${tagSide === "back" ? "is-back" : ""}`}><Image src={tagSide === "front" ? "/media/petbot-tag-front.png" : "/media/petbot-tag-back.png"} alt={tagSide === "front" ? "Personalised Petbot tag front" : "Petbot tag reverse with QR code"} fill sizes="(max-width: 900px) 90vw, 52vw" className="tag-image" /></div>
          <div className="tag-controls" role="group" aria-label="View tag side"><button type="button" onClick={() => setTagSide("front")} aria-pressed={tagSide === "front"}>Front</button><button type="button" onClick={() => setTagSide("back")} aria-pressed={tagSide === "back"}>Reverse / QR</button></div><p className="drag-note">Tap to turn the tag</p>
        </div>
      </section>

      <section className="how-section" id="how-it-works" aria-labelledby="how-title">
        <div className="how-visual" aria-hidden="true"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="scan-pulse">✦</span></div>
        <div className="how-content"><p className="eyebrow">One thoughtful connection</p><h2 id="how-title">One scan,<br /><em>one way home.</em></h2><p>The QR code links to a profile made for the moment a kind stranger wants to help. No app, no guesswork—just a gentler way to reconnect.</p><ul>{benefits.map((benefit) => <li key={benefit}><span aria-hidden="true">✦</span>{benefit}</li>)}</ul></div>
      </section>

      <section className="closing-section" aria-labelledby="closing-title"><Image src="/media/petbot-closing-pets.png" alt="A dog and cat resting together at sunrise" fill sizes="100vw" className="closing-image" /><div className="closing-wash" aria-hidden="true" /><div className="closing-content"><p className="eyebrow light">Petbot</p><h2 id="closing-title">For every curious<br /><em>little explorer.</em></h2><a className="button button-light" href="#tag">Choose their tag <span aria-hidden="true">↗</span></a></div></section>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Petbot</span><span>Made with care for every journey.</span></footer>
    </main>
  );
}
