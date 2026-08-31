"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEAM_CARDS = [
  {
    position: "left",
    title: "Invite members",
    description:
      "Bring everyone responsible for contracts into the same workspace.",
    image: "/assets/nature-2.webp",
  },
  {
    position: "center",
    title: "Create teams",
    description:
      "Organise your people into the teams and workspaces they already belong to.",
    image: "/assets/explosion.webp",
  },
  {
    position: "right",
    title: "Manage contracts",
    description: "Keep every contract, owner and important date in one place.",
    image: "/assets/nature-2.webp",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /*
       * =========================================
       * INTRO
       * =========================================
       */

      gsap.fromTo(
        "[data-teams='intro']",
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-teams='intro']",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /*
       * =========================================
       * MAIN CONTAINER
       * =========================================
       */

      gsap.fromTo(
        "[data-teams='scene']",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-teams='scene']",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /*
       * =========================================
       * CARDS
       * =========================================
       *
       * The side cards begin further behind the
       * centre card and gently move outward.
       */

      gsap.fromTo(
        "[data-teams='card-left']",
        {
          x: 80,
          rotate: -7,
          opacity: 0,
        },
        {
          x: 0,
          rotate: -7,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-teams='scene']",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        "[data-teams='card-center']",
        {
          y: 35,
          scale: 0.94,
          opacity: 0,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-teams='scene']",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        "[data-teams='card-right']",
        {
          x: -80,
          rotate: 7,
          opacity: 0,
        },
        {
          x: 0,
          rotate: 7,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-teams='scene']",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /*
       * =========================================
       * CLOSING COPY
       * =========================================
       */

      gsap.fromTo(
        "[data-teams='closing']",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-teams='closing']",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        bg-paper
        px-6
        py-32

        sm:px-10
        sm:py-40

        lg:px-[8%]
        lg:py-52
      "
    >
      {/* =========================================
          INTRO
      ========================================= */}

      <div data-teams="intro" className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40 sm:text-[11px]">
            Teams & workspaces
          </p>

          <h2
            className="
              mt-5
              font-display
              text-[clamp(3rem,6vw,6.5rem)]
              font-medium
              leading-[0.88]
              tracking-[-0.06em]
              text-ink
            "
          >
            Everyone sees
            <br />
            what matters.
          </h2>

          <p
            className="
              mt-8
              max-w-xl
              font-body
              text-base
              leading-7
              text-ink/50

              sm:text-lg
            "
          >
            Create teams, invite members and manage your entire contract
            portfolio together — all from one place.
          </p>
        </div>
      </div>

      {/* =========================================
          CARD SCENE
      ========================================= */}

      <div
        data-teams="scene"
        className="
          relative
          mx-auto
          mt-20
          flex
          min-h-[560px]
          max-w-7xl
          items-center
          justify-center
          overflow-hidden
          sm:mt-28
          sm:min-h-[650px]
          sm:rounded-[40px]

          lg:mt-36
          lg:min-h-[720px]
          lg:rounded-[48px]
        "
      >
        {/* =======================================
            DECORATIVE LABEL
        ======================================= */}

        <div className="absolute left-6 top-6 z-40 sm:left-10 sm:top-10">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/35">
            Renewly / Workspace
          </p>
        </div>

        {/* =======================================
            LEFT CARD
        ======================================= */}

        <div
          data-teams="card-left"
          className="
            absolute
            left-[-80px]
            top-1/2
            z-10
            hidden
            w-[300px]
            -translate-y-1/2

            md:block
            lg:left-[5%]
            lg:w-[330px]
          "
        >
          <TeamCard
            eyebrow="Members"
            title="Invite members"
            description="Bring everyone responsible for contracts into the same workspace."
            image="/assets/nature-2.webp"
            index="01"
          />
        </div>

        {/* =======================================
            CENTER CARD
        ======================================= */}

        <div
          data-teams="card-center"
          className="
            relative
            z-30
            w-[calc(100%-48px)]
            max-w-[390px]
            will-change-transform

            sm:max-w-[430px]
          "
        >
          <TeamCard
            eyebrow="Teams"
            title="Create teams"
            description="Organise your people into the teams and workspaces they already belong to."
            image="/assets/explosion.webp"
            index="02"
            featured
          />
        </div>

        {/* =======================================
            RIGHT CARD
        ======================================= */}

        <div
          data-teams="card-right"
          className="
            absolute
            right-[-80px]
            top-1/2
            z-10
            hidden
            w-[300px]
            -translate-y-1/2

            md:block
            lg:right-[5%]
            lg:w-[330px]
          "
        >
          <TeamCard
            eyebrow="Contracts"
            title="Manage contracts"
            description="Keep every contract, owner and important date in one place."
            image="/assets/nature-2.webp"
            index="03"
          />
        </div>

        {/* =======================================
            MOBILE SIDE CARDS
        ======================================= */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-6
            left-6
            hidden
            sm:block
            md:hidden
          "
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/30">
            3 connected views
          </span>
        </div>

        {/* =======================================
            BOTTOM LABEL
        ======================================= */}

        <div
          className="
            absolute
            bottom-6
            right-6
            z-40

            sm:bottom-10
            sm:right-10
          "
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/30">
            One workspace
          </p>
        </div>
      </div>

      {/* =========================================
          CLOSING
      ========================================= */}

      <div
        data-teams="closing"
        className="
          mx-auto
          mt-12
          max-w-7xl

          sm:mt-16
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              font-display
              text-2xl
              font-medium
              leading-[1]
              tracking-[-0.035em]
              text-ink

              sm:text-3xl
            "
          >
            One team.
            <br />
            One source of truth.
          </p>

          <p className="max-w-sm font-body text-sm leading-6 text-ink/45">
            No more contracts living in personal inboxes or spreadsheets that
            nobody remembers to update.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =============================================
   TEAM CARD
============================================= */

type TeamCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  index: string;
  featured?: boolean;
};

function TeamCard({
  eyebrow,
  title,
  description,
  image,
  index,
  featured = false,
}: TeamCardProps) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-[10px]
        border
        border-ink/10
        bg-white

        ${
          featured
            ? "shadow-[0_35px_80px_-35px_rgba(18,20,28,0.45)]"
            : "shadow-[0_25px_60px_-35px_rgba(18,20,28,0.3)]"
        }
      `}
    >
      {/* =======================================
          IMAGE FRAME
      ======================================= */}

      <div
        className="
          relative
          m-3
          aspect-[4/3]
          overflow-hidden
          rounded-[6px]
          border
          border-ink/10
          bg-paper-muted

          sm:m-4
        "
      >
        <img
          src={image}
          alt=""
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />

        {/* Image frame overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            border-[6px]
            border-white/20
          "
        />

        {/* Image index */}

        <div
          className="
            absolute
            left-3
            top-3
            rounded-full
            border
            border-white/30
            bg-white/75
            px-2.5
            py-1
            backdrop-blur-sm
          "
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink/60">
            {index}
          </span>
        </div>
      </div>

      {/* =======================================
          CARD CONTENT
      ======================================= */}

      <div className="px-5 pb-6 pt-2 sm:px-6 sm:pb-7">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/35">
          {eyebrow}
        </p>

        <h3
          className={`
            mt-3
            font-display
            font-medium
            leading-[0.95]
            tracking-[-0.035em]
            text-ink

            ${featured ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}
          `}
        >
          {title}
        </h3>

        <p className="mt-4 font-body text-xs leading-5 text-ink/45 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
