import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./edc.css";
import { LogoGayrimenkul, LogoMotors, EdcMark } from "./EdcLogos";

/* ───────── AYARLAR ─────────
   Sahibinden portföy linkleri gelince buraya yazın. Boş kalırsa butonlar iletişime gider. */
const PORTFOLIO = { gayrimenkul: "", motors: "" };

const U = (id: string, w = 1800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
const IMG = {
  hero: U("1600585154340-be6161a56a0c", 2400),
  sale: U("1613490493576-7fde63acd811", 1400),
  rent: U("1600607687939-ce8a6c25118c", 1400),
  auth: U("1600566753190-17f0baa2a6c3", 1400),
  show: U("1600573472550-8090b5e0745e", 1400),
  co1: U("1600210492486-724fe5c67fb0", 1400),
  co2: U("1512917774080-9991f1c4c750", 1400),
  co3: U("1486406146926-c627a92ad1ab", 1400),
  car: U("1503376780353-7e6692767b70", 2400),
  garage: U("1492144534655-ae79c964c9d7", 1400),
  amg: U("1618843479313-40f8afb4b4d8", 1400),
  pfHome: U("1600596542815-ffad4c1539a9", 1600),
  villa: U("1613977257363-707ba9348227", 1000),
};

const SERVICES = [
  { tag: "Satış", title: "Satış aracılığı", text: "Alıcı ile satıcı arasındaki süreci yürütür; koşulları satış ve hizmet bedeli sözleşmesiyle kayda geçiririz.", img: IMG.sale },
  { tag: "Kiralama", title: "Kiralama aracılığı", text: "Mülk sahibi ile kiracı adayı arasında, gösterimden anlaşmaya kadar görüşmeleri birlikte yürütürüz.", img: IMG.rent },
  { tag: "Yetkilendirme", title: "Aracılık ve yetkilendirme", text: "Mülk sahipleriyle yapılan yetkilendirme sözleşmesiyle portföy süreci açık koşullarla başlar.", img: IMG.auth },
  { tag: "Yer gösterme", title: "Yer gösterme ve bilgilendirme", text: "Gösterilen mülkler yer gösterme belgesiyle kayda geçer; her aşamada sizi bilgilendiririz.", img: IMG.show },
];

const STEPS = [
  { n: "01", title: "İhtiyacı dinleriz", text: "Ne aradığınızı, önceliklerinizi ve zamanlamanızı konuşarak başlarız.", img: IMG.co1 },
  { n: "02", title: "Seçenekleri birlikte değerlendiririz", text: "Uygun olabilecek seçenekleri artıları ve dikkat edilecek yönleriyle açıkça paylaşırız.", img: IMG.co2 },
  { n: "03", title: "Süreç boyunca bilgilendiririz", text: "Görüşmeden anlaşmaya kadar her adımda nerede olduğunuzu bilirsiniz.", img: IMG.co3 },
];

const STATEMENT =
  "EDC, Ankara’da gayrimenkulü merkezine alan; otomobil ve danışmanlıkla bu odağı tamamlayan bir çatı markadır. Karar sizindir; biz süreci düzenli ve anlaşılır tutarız.";

const MARQUEE = ["Satış", "Kiralama", "Yetkilendirme", "Yer gösterme", "EDC Motors", "Danışmanlık"];

const CONTACTS = [
  { label: "M. Buğrahan Narmanlı", value: "+90 (535) 621 23 93", href: "tel:+905356212393", copy: "+90 535 621 23 93" },
  { label: "Erol Kalay", value: "+90 (532) 693 22 00", href: "tel:+905326932200", copy: "+90 532 693 22 00" },
  { label: "E-posta", value: "edcgayrimenkulmotors@gmail.com", href: "mailto:edcgayrimenkulmotors@gmail.com", copy: "edcgayrimenkulmotors@gmail.com" },
];

const NAV = [
  ["kurumsal", "Kurumsal"],
  ["gayrimenkul", "Gayrimenkul"],
  ["motors", "Motors"],
  ["danismanlik", "Danışmanlık"],
  ["portfoy", "Portföy"],
  ["iletisim", "İletişim"],
] as const;

/* Harf harf bölünmüş metin (ekran okuyucu için üst öğede aria-label kullanın) */
function Chars({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="wd" aria-hidden="true">
            {[...w].map((c, j) => <span key={j} className="ch">{c}</span>)}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}

/* Satır maskeli başlık */
function Lines({ lines }: { lines: (string | { t: string; em: true })[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className="ln" aria-hidden="true">
          <span className={`ln-in ${typeof l === "string" ? "" : "em"}`}>{typeof l === "string" ? l : l.t}</span>
        </span>
      ))}
    </>
  );
}

const Arrow = ({ ext = false }: { ext?: boolean }) => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    {ext ? (
      <path d="M4 12L12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    ) : (
      <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    )}
  </svg>
);

function portfolioProps(kind: "gayrimenkul" | "motors") {
  const url = PORTFOLIO[kind].trim();
  return url ? { href: url, target: "_blank", rel: "noopener" } : { href: "#iletisim" };
}

function useAnkaraTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function EdcSite() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const time = useAnkaraTime();

  const copy = (t: string) => {
    navigator.clipboard?.writeText(t).then(() => {
      setCopied(t);
      setTimeout(() => setCopied(null), 1500);
    }).catch(() => {});
  };

  useEffect(() => {
    if (menu) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [menu]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current!;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    /* ── Lenis + ScrollTrigger ── */
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || !el.contains(a)) return;
      const id = a.getAttribute("href")!;
      const target = id === "#top" ? 0 : document.querySelector<HTMLElement>(id);
      if (target === null) return;
      e.preventDefault();
      setMenu(false);
      lenis.start();
      lenis.scrollTo(target, { duration: 1.8, easing: (x) => 1 - Math.pow(1 - x, 4) });
    };
    el.addEventListener("click", onAnchor);

    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);

      /* ── Açılış ── */
      lenis.stop();
      const counter = { v: 0 };
      const num = q(".ld-num")[0];
      const intro = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => lenis.start() });
      intro
        .fromTo(".ld-img", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, stagger: 0.28, ease: "expo.inOut" }, 0)
        .from(".ld-img img", { scale: 1.6, duration: 1.4, stagger: 0.28 }, 0)
        .to(counter, {
          v: 100, duration: 1.9, ease: "power3.inOut",
          onUpdate: () => { if (num) num.textContent = String(Math.round(counter.v)).padStart(3, "0"); },
        }, 0)
        .to(".ld-imgs", { scale: 0.86, duration: 0.8, ease: "power3.in" }, 1.6)
        .to(".loader", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, 1.95)
        .from(".hero-h .ch", { yPercent: 115, rotate: 6, duration: 1.3, stagger: 0.022 }, 2.35)
        .to(".hero-curtain", { scaleY: 0, duration: 1.4, ease: "expo.inOut" }, 2.3)
        .from(".hero-media img", { scale: 1.5, duration: 2.2 }, 2.3)
        .from(".nav > *", { y: -24, opacity: 0, duration: 1, stagger: 0.06 }, 2.6)
        .from(".hero-top > *, .hero-foot > *", { y: 18, opacity: 0, duration: 1, stagger: 0.06 }, 2.7);

      const mm = gsap.matchMedia();

      /* ── Hero: pencere ekranı kaplar, başlık yukarı süzülür ── */
      mm.add({ desk: "(min-width: 761px)", mob: "(max-width: 760px)" }, (c) => {
        const { desk } = c.conditions as { desk: boolean };
        const from = desk ? "inset(56% 26% 7% 26% round 20px)" : "inset(44% 4% 20% 4% round 16px)";
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".hero", start: "top top", end: "+=150%", scrub: 1, pin: ".hero-pin", anticipatePin: 1 },
        });
        tl.fromTo(".hero-media", { clipPath: from }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(".hero-media img", { scale: 1.25 }, { scale: 1, ease: "none", duration: 1 }, 0)
          .to(".hero-h", { yPercent: -35, opacity: 0, ease: "power2.in", duration: 0.55 }, 0)
          .to(".hero-top, .hero-foot", { opacity: 0, duration: 0.25 }, 0)
          .fromTo(".hero-over", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.7)
          .from(".hero-over .ln-in", { yPercent: 110, stagger: 0.05, duration: 0.25 }, 0.72)
          .from(".hero-over .fade", { y: 30, opacity: 0, stagger: 0.05, duration: 0.25 }, 0.8);
      });

      /* ── Kayan şerit: kaydırma yönüne göre döner ── */
      const mq = gsap.to(".mq-track", { xPercent: -50, repeat: -1, duration: 30, ease: "none" });
      mq.totalTime(30 * 200);
      let dir = 1;
      ScrollTrigger.create({
        onUpdate: (s) => {
          if (s.direction !== dir) dir = s.direction;
          const boost = Math.min(5, 1 + Math.abs(s.getVelocity()) / 600);
          gsap.to(mq, { timeScale: dir * boost, duration: 0.2, overwrite: true });
          gsap.to(mq, { timeScale: dir, duration: 1.2, delay: 0.25, overwrite: false });
          gsap.to(".mq-track", { skewX: gsap.utils.clamp(-8, 8, -s.getVelocity() / 300), duration: 0.4, overwrite: "auto" });
        },
      });

      /* ── Satır başlıkları ── */
      q(".reveal").forEach((h) => {
        gsap.from(h.querySelectorAll(".ln-in"), {
          yPercent: 110, rotate: 2, stagger: 0.08, duration: 1.3, ease: "expo.out",
          scrollTrigger: { trigger: h, start: "top 86%" },
        });
      });
      q(".up").forEach((u) => {
        gsap.from(u, { y: 36, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: u, start: "top 90%" } });
      });
      q(".rule").forEach((r) => {
        gsap.from(r, { scaleX: 0, transformOrigin: "0 50%", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: r, start: "top 92%" } });
      });

      /* ── Kurumsal: kelimeler kaydırdıkça mürekkeplenir ── */
      gsap.fromTo(".statement .sw", { opacity: 0.12 }, {
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: ".statement", start: "top 80%", end: "bottom 50%", scrub: true },
      });

      /* ── Gayrimenkul: yatay galeri ── */
      mm.add("(min-width: 761px)", () => {
        const track = q(".re-track")[0];
        const bar = q(".re-bar i")[0];
        const idx = q(".re-idx")[0];
        const dist = () => track.scrollWidth - window.innerWidth;
        const h = gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: {
            trigger: ".re", start: "top top", end: () => "+=" + dist(), scrub: 1, pin: ".re-pin", invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (s) => {
              gsap.set(bar, { scaleX: s.progress });
              if (idx) idx.textContent = String(Math.min(SERVICES.length, Math.floor(s.progress * SERVICES.length) + 1)).padStart(2, "0");
            },
          },
        });
        q(".re-card").forEach((card) => {
          const img = card.querySelector("img");
          gsap.fromTo(img, { filter: "grayscale(1) brightness(0.8)", scale: 1.18 }, {
            filter: "grayscale(0) brightness(1)", scale: 1, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: h, start: "left 95%", end: "center 55%", scrub: true },
          });
        });
      });
      mm.add("(max-width: 760px)", () => {
        q(".re-card").forEach((card) => {
          gsap.from(card.querySelector(".re-img"), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: card, start: "top 85%" } });
        });
      });

      /* ── Motors: sayfa karanlığa döner, görsel daireden açılır ── */
      const mt = gsap.timeline({
        scrollTrigger: { trigger: ".mo", start: "top top", end: "+=170%", scrub: 1, pin: ".mo-pin", anticipatePin: 1 },
      });
      mt.fromTo(".mo-media", { clipPath: "circle(11% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "power2.inOut", duration: 1 }, 0)
        .fromTo(".mo-media img", { scale: 1.6, rotate: -4 }, { scale: 1, rotate: 0, ease: "power2.out", duration: 1 }, 0)
        .to(".mo-w1", { xPercent: -70, ease: "power2.in", duration: 0.7 }, 0)
        .to(".mo-w2", { xPercent: 70, ease: "power2.in", duration: 0.7 }, 0)
        .to(".mo-type", { opacity: 0, duration: 0.2 }, 0.55)
        .fromTo(".mo-over", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.75)
        .from(".mo-over .ln-in", { yPercent: 110, stagger: 0.05, duration: 0.2 }, 0.78)
        .from(".mo-over .fade", { y: 24, opacity: 0, stagger: 0.05, duration: 0.2 }, 0.85);
      // Pin'den sonra oluşturulur ki pin boşluğu hesaba katılsın
      ScrollTrigger.create({ trigger: "#motors", start: "top 55%", end: "bottom 45%", toggleClass: { targets: el, className: "is-dark" } });

      /* ── Paralaks ── */
      q("[data-px]").forEach((im) => {
        const amt = Number(im.dataset.px || 10);
        gsap.fromTo(im, { yPercent: -amt }, { yPercent: amt, ease: "none", scrollTrigger: { trigger: im.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      q(".clip-in").forEach((c) => {
        gsap.from(c, { clipPath: "inset(100% 0% 0% 0% round 24px)", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: c, start: "top 88%" } });
      });

      /* ── Danışmanlık: yapışkan çerçevede görsel geçişi ── */
      const frames = q(".adv-frame img");
      const steps = q(".adv-step");
      const count = q(".adv-count")[0];
      steps.forEach((s, i) => {
        ScrollTrigger.create({
          trigger: s, start: "top 55%", end: "bottom 55%",
          onToggle: (st) => {
            s.classList.toggle("on", st.isActive);
            if (st.isActive && count) count.textContent = STEPS[i].n;
          },
        });
        if (i === 0) return;
        gsap.fromTo(frames[i], { clipPath: "inset(100% 0% 0% 0%)", scale: 1.2 }, {
          clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "none",
          scrollTrigger: { trigger: s, start: "top 95%", end: "top 50%", scrub: true },
        });
      });

      /* ── Alt bilgi logosu ── */
      gsap.from(".foot-mark path", {
        yPercent: 110, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: ".foot-mark", start: "top 100%", end: "bottom bottom", scrub: 1 },
      });
      gsap.from(".ct-h .ch", {
        yPercent: 115, stagger: 0.015, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".ct-h", start: "top 85%" },
      });

      /* ── Menü: aşağıda gizlen, yukarıda görün ── */
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (s) => el.querySelector(".nav")?.classList.toggle("hide", s.direction === 1 && s.scroll() > window.innerHeight * 0.6),
      });

      /* ── İmleç ve manyetik butonlar (yalnız fare) ── */
      if (fine) {
        const cur = q(".cursor")[0];
        const label = q(".cursor-label")[0];
        const cx = gsap.quickTo(cur, "x", { duration: 0.45, ease: "power3" });
        const cy = gsap.quickTo(cur, "y", { duration: 0.45, ease: "power3" });
        const move = (e: PointerEvent) => { cx(e.clientX); cy(e.clientY); };
        const over = (e: Event) => {
          const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
          cur.classList.toggle("big", !!t);
          if (t && label) label.textContent = t.dataset.cursor || "";
          cur.classList.toggle("link", !t && !!(e.target as HTMLElement).closest("a, button"));
        };
        window.addEventListener("pointermove", move);
        el.addEventListener("pointerover", over);
        cleanups.push(() => { window.removeEventListener("pointermove", move); el.removeEventListener("pointerover", over); });

        (q("[data-magnetic]") as HTMLElement[]).forEach((m) => {
          const mx = gsap.quickTo(m, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
          const my = gsap.quickTo(m, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
          const mv = (e: PointerEvent) => {
            const r = m.getBoundingClientRect();
            mx((e.clientX - (r.left + r.width / 2)) * 0.35);
            my((e.clientY - (r.top + r.height / 2)) * 0.35);
          };
          const lv = () => { mx(0); my(0); };
          m.addEventListener("pointermove", mv);
          m.addEventListener("pointerleave", lv);
          cleanups.push(() => { m.removeEventListener("pointermove", mv); m.removeEventListener("pointerleave", lv); });
        });
      }
    }, el);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("load", onLoad);
      el.removeEventListener("click", onAnchor);
      cleanups.forEach((f) => f());
      ctx.revert();
      el.classList.remove("is-dark");
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div className="edc" ref={root}>
      <div className="cursor" aria-hidden="true"><span className="cursor-label" /></div>

      {/* Açılış */}
      <div className="loader" aria-hidden="true">
        <div className="ld-top mono"><span>EDC Gayrimenkul &amp; Motors</span><span>Çankaya / Ankara</span></div>
        <div className="ld-imgs">
          {[IMG.villa, IMG.sale, IMG.hero].map((s, i) => (
            <div className="ld-img" key={i}><img src={s} alt="" /></div>
          ))}
        </div>
        <div className="ld-bot"><span className="mono">Doğru Yatırım, Güvenli Gelecek.</span><span className="ld-num">000</span></div>
      </div>

      {/* Menü */}
      <header className="nav">
        <a href="#top" className="nav-logo" aria-label="EDC Gayrimenkul ana sayfa"><LogoGayrimenkul /></a>
        <nav className="nav-links" aria-label="Ana menü">
          {NAV.slice(0, 5).map(([id, t]) => <a key={id} href={`#${id}`}><span data-t={t}>{t}</span></a>)}
        </nav>
        <span className="nav-time mono">Ankara {time}</span>
        <a href="#iletisim" className="nav-cta">İletişim <Arrow /></a>
        <button className="nav-burger" aria-expanded={menu} onClick={() => setMenu(!menu)} aria-label="Menü">
          <i /><i />
        </button>
      </header>
      <div className={`mmenu ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <nav aria-label="Mobil menü">
          {NAV.map(([id, t], i) => (
            <a key={id} href={`#${id}`} style={{ transitionDelay: menu ? `${0.08 + i * 0.05}s` : "0s" }} tabIndex={menu ? 0 : -1}>
              <span className="mono">0{i + 1}</span>{t}
            </a>
          ))}
        </nav>
        <p className="mono">Officium Beytepe · Çankaya / Ankara</p>
      </div>

      <main>
        {/* HERO */}
        <section className="hero" id="top">
          <div className="hero-pin">
            <div className="hero-top wrap mono">
              <span>(EDC)</span>
              <span>Gayrimenkul — Motors — Danışmanlık</span>
              <span className="hide-sm">39.87° K, 32.73° D</span>
            </div>
            <h1 className="hero-h wrap" aria-label="Doğru yatırım, güvenli gelecek.">
              <span className="hl"><Chars text="Doğru yatırım," /></span>
              <span className="hl hl-2"><Chars text="güvenli gelecek." /></span>
            </h1>
            <div className="hero-media">
              <img src={IMG.hero} alt="Gün batımında ışıkları yanan modern bir konut (temsili görsel)" />
              <div className="hero-curtain" />
              <div className="hero-over">
                <div className="wrap hero-over-in">
                  <p className="mono fade">EDC Gayrimenkul · Ankara</p>
                  <h2 className="h-xl" aria-label="Doğru mülke giden yol, birlikte.">
                    <Lines lines={["Doğru mülke", "giden yol,", { t: "birlikte.", em: true }]} />
                  </h2>
                  <div className="hero-over-row">
                    <p className="lead fade">Gayrimenkul odağımızı otomobil ve danışmanlık hizmetlerimizle tamamlıyor; ihtiyaçlarınıza uygun seçenekleri birlikte değerlendiriyoruz.</p>
                    <div className="btns fade">
                      <a className="btn btn-solid" data-magnetic {...portfolioProps("gayrimenkul")}>Portföyümüzü Gör <span className="btn-ic"><Arrow /></span></a>
                      <a className="btn btn-ghost" href="#iletisim">Bizimle İletişime Geçin</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-foot wrap">
              <p className="hero-lead">Ankara’da satış, kiralama ve aracılık süreçlerini belgeli ve anlaşılır biçimde yürütüyoruz.</p>
              <span className="scroll-cue" aria-hidden="true">
                <svg viewBox="0 0 100 100" width="92" height="92">
                  <defs><path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
                  <text><textPath href="#circ">KAYDIRIN • KEŞFEDİN • KAYDIRIN • KEŞFEDİN •</textPath></text>
                </svg>
                <i>↓</i>
              </span>
            </div>
          </div>
        </section>

        {/* ŞERİT */}
        <div className="mq" aria-hidden="true">
          <div className="mq-track">
            {[0, 1].map((k) => (
              <div className="mq-set" key={k}>
                {MARQUEE.map((m) => <span key={m}>{m}<i>✦</i></span>)}
              </div>
            ))}
          </div>
        </div>

        {/* KURUMSAL */}
        <section className="sec" id="kurumsal">
          <div className="wrap">
            <div className="idx-row">
              <span className="mono up">(01) Kurumsal</span>
              <span className="mono up hide-sm">Hakkımızda</span>
            </div>
            <p className="statement">
              {STATEMENT.split(" ").map((w, i) => <span key={i} className="sw">{w} </span>)}
            </p>
            <div className="corp">
              <div className="corp-media clip-in"><img data-px="8" src={IMG.villa} alt="Modern bir konutun dış cephesi (temsili görsel)" loading="lazy" /></div>
              <div className="corp-txt">
                <p className="body up">Satış, kiralama ve aracılık süreçlerinde tarafların neyi, hangi koşulla ve ne zaman yapacağını baştan netleştirmeye önem veriyoruz. Aynı yaklaşımı EDC Motors’ta da sürdürüyoruz.</p>
                <dl className="facts">
                  {[
                    ["Merkez", "Officium Beytepe, Çankaya / Ankara"],
                    ["Ana alan", "Gayrimenkul: satış, kiralama, aracılık"],
                    ["Çalışma biçimi", "Yazılı sözleşme ve belgelerle ilerleyen süreçler"],
                  ].map(([k, v]) => (
                    <div key={k} className="up">
                      <i className="rule" />
                      <dt className="mono">{k}</dt><dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* GAYRİMENKUL: yatay galeri */}
        <section className="re" id="gayrimenkul">
          <div className="re-pin">
            <div className="re-head wrap">
              <div>
                <span className="mono up">(02) Ana faaliyet alanı</span>
                <h2 className="h-l reveal" aria-label="Satıştan kiralamaya, her adımı belgeli.">
                  <Lines lines={["Satıştan kiralamaya,", { t: "her adımı belgeli.", em: true }]} />
                </h2>
              </div>
              <div className="re-meta">
                <p className="lead up">Satmak, satın almak ya da kiralamak istediğiniz mülk için tarafları bir araya getiriyor, her aşamayı yazılı hale getiriyoruz.</p>
                <div className="re-prog mono hide-sm">
                  <span className="re-idx">01</span><span className="re-bar"><i /></span><span>0{SERVICES.length}</span>
                </div>
              </div>
            </div>
            <div className="re-track">
              {SERVICES.map((s, i) => (
                <article className="re-card" key={s.tag} data-cursor="Sürükle">
                  <div className="re-img"><img src={s.img} alt={`${s.title} (temsili görsel)`} loading="lazy" /></div>
                  <div className="re-info">
                    <span className="mono">0{i + 1} — {s.tag}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </article>
              ))}
              <div className="re-end">
                <p className="mono">Görseller temsilidir</p>
                <a className="btn btn-solid" data-magnetic {...portfolioProps("gayrimenkul")}>Portföyümüzü Gör <span className="btn-ic"><Arrow /></span></a>
              </div>
            </div>
          </div>
        </section>

        {/* MOTORS */}
        <section className="mo" id="motors">
          <div className="mo-pin">
            <div className="mo-type" aria-hidden="true">
              <span className="mo-w1">EDC</span>
              <span className="mo-w2">MOTORS</span>
            </div>
            <div className="mo-media">
              <img src={IMG.car} alt="Akşam yolda ilerleyen siyah bir otomobil (temsili görsel)" />
            </div>
            <div className="mo-over">
              <div className="wrap mo-over-in">
                <span className="mo-logo fade"><LogoMotors /></span>
                <h2 className="h-xl" aria-label="Aynı özen, yolda da.">
                  <Lines lines={["Aynı özen,", { t: "yolda da.", em: true }]} />
                </h2>
                <p className="lead fade">Gayrimenkulde benimsediğimiz açıklığı araç süreçlerinde de sürdürürüz.</p>
              </div>
            </div>
          </div>
          <div className="wrap mo-detail">
            <div className="mo-text">
              <span className="mono up">(03) Otomobil</span>
              <p className="lead-big up">EDC Motors, markamızın otomobil alanındaki koludur. İhtiyacınızdan başlar, koşulları açıkça konuşuruz.</p>
              <ul className="mo-list">
                {[
                  "İhtiyacınızı ve bütçenizi dinleyerek başlarız",
                  "Uygun seçenekleri ve koşulları açıkça konuşuruz",
                  "Güncel araç portföyümüzü dış bağlantıdan paylaşırız",
                ].map((t, i) => (
                  <li key={t} className="up"><i className="rule" /><span className="mono">0{i + 1}</span>{t}</li>
                ))}
              </ul>
              <a className="btn btn-solid up" data-magnetic {...portfolioProps("motors")}>Araç Portföyümüzü Gör <span className="btn-ic"><Arrow /></span></a>
            </div>
            <div className="mo-imgs">
              <figure className="ph clip-in"><img data-px="10" src={IMG.garage} alt="Showroom’da otomobiller (temsili görsel)" loading="lazy" /></figure>
              <figure className="ph ph-2 clip-in"><img data-px="10" src={IMG.amg} alt="Gri spor otomobil (temsili görsel)" loading="lazy" /></figure>
            </div>
          </div>
        </section>

        {/* DANIŞMANLIK */}
        <section className="sec adv" id="danismanlik">
          <div className="wrap adv-grid">
            <div className="adv-sticky">
              <div className="adv-frame">
                {STEPS.map((s) => <img key={s.n} src={s.img} alt="" loading="lazy" />)}
                <span className="adv-count">01</span>
              </div>
            </div>
            <div className="adv-col">
              <div className="adv-head">
                <span className="mono up">(04) Danışmanlık</span>
                <h2 className="h-l reveal" aria-label="Karar vermeden önce, birlikte değerlendirelim.">
                  <Lines lines={["Karar vermeden", "önce, birlikte", { t: "değerlendirelim.", em: true }]} />
                </h2>
                <p className="lead up">Danışmanlık, gayrimenkul ve otomobil süreçlerimizi destekleyen hizmetimizdir. Neye ihtiyacınız olduğunu birlikte netleştiririz.</p>
              </div>
              {STEPS.map((s) => (
                <article className="adv-step" key={s.n}>
                  <div className="adv-step-img"><img src={s.img} alt="" loading="lazy" /></div>
                  <span className="adv-n">{s.n}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PORTFÖY */}
        <section className="sec pf-sec" id="portfoy">
          <div className="wrap">
            <div className="pf-head">
              <h2 className="h-l reveal" aria-label="Portföyümüzü inceleyin.">
                <Lines lines={["Portföyümüzü", { t: "inceleyin.", em: true }]} />
              </h2>
              <p className="lead up">İlanlarımızı dış platformda güncel tutuyoruz. İncelemek istediğiniz portföyü seçin.</p>
            </div>
            <div className="pf">
              {([
                ["gayrimenkul", "Gayrimenkul", PORTFOLIO.gayrimenkul ? "Portföyümüzü Gör" : "Portföyümüz için bize ulaşın", IMG.pfHome, "Havuzlu modern villa (temsili görsel)"],
                ["motors", "EDC Motors", PORTFOLIO.motors ? "Araç Portföyümüzü Gör" : "Araç portföyümüz için bize ulaşın", IMG.amg, "Spor otomobil (temsili görsel)"],
              ] as const).map(([k, tag, title, img, alt], i) => (
                <a key={k} className={`pf-card ${i ? "pf-2" : ""}`} data-cursor="İncele" {...portfolioProps(k)}>
                  <div className="pf-img clip-in"><img data-px="6" src={img} alt={alt} loading="lazy" /></div>
                  <div className="pf-bar">
                    <div><span className="mono">0{i + 1} / {tag}</span><strong>{title}</strong></div>
                    <span className="pf-arrow"><Arrow ext /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* İLETİŞİM */}
        <section className="ct" id="iletisim">
          <div className="wrap">
            <span className="mono up">(05) İletişim · Çankaya / Ankara</span>
            <h2 className="ct-h" aria-label="Bir görüşmeyle başlayalım.">
              <span className="hl"><Chars text="Bir görüşmeyle" /></span>
              <span className="hl hl-2"><Chars text="başlayalım." /></span>
            </h2>
            <div className="ct-row">
              <p className="lead up">Gayrimenkul, otomobil ya da danışmanlık için bizi arayabilir, e-posta gönderebilir veya ofisimize uğrayabilirsiniz.</p>
              <a className="ct-call" href="tel:+905356212393" data-magnetic aria-label="Bizi arayın">
                <span>Bizi<br />arayın</span>
              </a>
            </div>
            <div className="ct-grid">
              {CONTACTS.map((c) => (
                <div className="ct-card up" key={c.label}>
                  <span className="mono">{c.label}</span>
                  <a href={c.href} className={c.href.startsWith("mailto") ? "ct-mail" : ""}>{c.value}</a>
                  <button onClick={() => copy(c.copy)}>{copied === c.copy ? "Kopyalandı ✓" : "Kopyala"}</button>
                </div>
              ))}
              <div className="ct-card up">
                <span className="mono">Adres</span>
                <address>Beytepe Mahallesi 5314. Cad. No: 4/A<br />İç Kapı No: 89, Officium Beytepe<br />Çankaya / Ankara</address>
                <a className="ct-map" href="https://www.google.com/maps/search/?api=1&query=Officium+Beytepe+%C3%87ankaya+Ankara" target="_blank" rel="noopener">Haritada aç <Arrow ext /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ALT BİLGİ */}
      <footer className="foot">
        <div className="wrap">
          <div className="foot-top">
            <p className="foot-slogan">Doğru Yatırım,<br /><em>Güvenli Gelecek.</em></p>
            <nav className="foot-nav" aria-label="Alt menü">
              {NAV.map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}
            </nav>
          </div>
          <div className="foot-mark" aria-hidden="true"><EdcMark /></div>
          <div className="foot-bot">
            <span>© {new Date().getFullYear()} EDC Gayrimenkul &amp; Motors · Çankaya / Ankara</span>
            <a href="#top">Başa dön ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
