import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Mian Muhammad Hamza Shakeel",
  initials: "HS",
  url: "https://hamzashakeel.com",
  location: "Mississauga, Ontario, Canada",
  locationLink: "https://www.google.com/maps/place/Mississauga,+ON",
  description:
  "WordPress & web developer building fast, reliable sites for healthcare, security and data-driven teams.",

  summary:
  "7+ years of experience building fast, accessible, SEO-driven sites for healthcare, security, and data-driven teams. Recent work includes data dashboards and a digital front door for Health Workforce Canada, a marketing and custom WordPress site for Plurilock Security, and web experiences ranging from lean landing pages to large-scale content sites. I like building sharp, practical things—custom Gutenberg blocks, lightweight internal plugins, and integrations that help non-technical teams move faster instead of fighting their tools.",
  avatarUrl: "/me.jpeg", // put your headshot at /public/me.jpeg

  skills: [
    // WordPress-heavy stuff first
    "WordPress (Gutenberg / Elementor)",
    "Custom WordPress themes",
    "Custom WordPress plugins",
    "WooCommerce",
    "Advanced Custom Fields (ACF)",
    "Headless WordPress (REST API)",
    "WordPress performance optimization (caching / images / CDNs)",
    "WordPress security & hardening",
    "WordPress migrations & maintenance",
    "Multisite & multi-language (WPML / Polylang)",

    // Frontend / JS stack
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "Drupal",
    "Shopify",
    "Webflow",

    // Infra / data / tooling
    "AWS (Kendra, Lambda, S3, CloudFront)",
    "Google Analytics 4",
    "Google Tag Manager",
    "Google Search Console",
    "SEO",
    "Mailchimp / Drip",
    "n8n",
    "DNS / SMTP / SPF / DKIM / DMARC",

    // Design / content
    "Adobe Creative Suite",
    "Canva",
  ],

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "mianmuhammadhamza@gmail.com",
    tel: "+1 647 613 9953",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Hamza0",
        icon: Icons.github,
        navbar: false, // was true – now hidden from dock
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/mianhamza",
        icon: Icons.linkedin,
        navbar: true, // keep this in the dock
      },
      X: {
        name: "X",
        url: "https://x.com/heyhamzah",
        icon: Icons.x,
        navbar: false, // hide
      },
      Youtube: {
        name: "YouTube",
        url: "https://www.youtube.com/@heyhamzah",
        icon: Icons.youtube,
        navbar: false, // hide
      },
      Call: {
        name: "Call",
        url: "tel:+16476139953",
        icon: Icons.phone, // we'll add this icon below
        navbar: true,      // show in dock
      },
      email: {
        name: "Send Email",
        url: "mailto:mianmuhammadhamza@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  // Put logo files in /public/logos with these filenames
  work: [
    {
      company: "Health Workforce Canada",
      href: "https://healthworkforce.ca",
      badges: ["Contract", "Healthcare"],
      location: "Ottawa, ON / Remote",
      title: "Website Developer – Corporate Services",
      logoUrl: "/logos/healthworkforce.png",
      start: "Jun 2024",
      end: "Jul 2025",
      description:
        "Lead developer for healthworkforce.ca. Built and iterated on the Digital Front Door (AI-powered intelligent search), the Dashboards landing and use-case experience, and the Modelling & Forecasting microsite. Implemented AWS Kendra + Lambda integration in WordPress, designed Gutenberg block-based layouts for pages and resource hubs, integrated third-party APIs/plugins, managed domain and DNS, and configured SPF/DKIM/DMARC + SMTP relays. Supported analytics, campaigns and emergency communications content while keeping the site accessible and maintainable.",
    },
    {
      company: "Stratomer IT",
      href: "https://stratomerit.com",
      badges: ["Part-time"],
      location: "Edmonton, AB / Remote",
      title: "Website Developer",
      logoUrl: "/logos/stratomer.png",
      start: "Jun 2023",
      end: "Mar 2025",
      description:
        "Planned and executed digital marketing web work for IT and security services: SEO-first websites, landing pages and email funnels. Implemented and monitored SEO strategies, optimized performance and UX, integrated tools like GA4, GSC, Tag Manager and Salesforce, and produced marketing assets using Adobe Creative Suite and Canva.",
    },
    {
      company: "Plurilock Security",
      href: "https://plurilock.com",
      badges: ["Cybersecurity"],
      location: "Victoria, BC / Remote",
      title: "Website Developer / Administrator",
      logoUrl: "/logos/plurilock.jpeg",
      start: "May 2022",
      end: "Nov 2022",
      description:
        "Owned front-end development and website administration for a cybersecurity SaaS. Created and maintained CSS/HTML/PHP templates, ensured brand consistency, improved performance and collaborated with product, UX and marketing teams to solve complex UX problems and ship new marketing pages and reporting / dashboard views in an agile environment.",
    },
    {
      company: "Ibex",
      href: "https://www.ibex.co/",
      badges: ["CX / BPO"],
      location: "Lahore, Pakistan",
      title: "Website Developer",
      logoUrl: "/logos/ibex.jpeg",
      start: "Jul 2019",
      end: "Jun 2021",
      description:
        "Modified existing and built new marketing and campaign sites for enterprise clients: restructuring layouts, adding and updating content, integrating forms, banners and popups, and collaborating with internal product, design and account teams to deliver reliable, on-brand experiences.",
    },
    {
      company: "Tech Nerds",
      href: "https://technerds.com",
      badges: ["Agency"],
      location: "Remote / Miami-based",
      title: "Website Developer",
      logoUrl: "/logos/technerds.png",
      start: "Aug 2018",
      end: "Feb 2019",
      description:
        "Built industrial-scale WordPress and HTML sites for a US digital agency. Delivered site builds, analytics setups, landing pages and graphic assets, including tracking (GA, GSC, GTM, pixels) and recommendations based on website analysis.",
    },
  ],

  education: [
    {
      school: "Forman Christian College (A Chartered University)",
      href: "https://www.fccollege.edu.pk",
      degree: "BCS – Computer Science (Software Engineering & IT)",
      logoUrl: "/logos/fcc.png",
      start: "2012",
      end: "2016",
    },
  ],

  projects: [
    {
      title:
        "Health Workforce Canada – Digital Front Door, Dashboards & Modelling",
      href: "https://healthworkforce.ca/digital-front-door/",
      dates: "2024 – 2025",
      active: true,
      description:
        "End-to-end web experience for Health Workforce Canada’s digital front door and data tools. Built the Digital Front Door (AI-powered intelligent search), the Dashboards landing and use-case flows, and the Modelling & Forecasting microsite. Implemented AWS Kendra + Lambda in WordPress, designed Gutenberg block-based layouts, and wired in analytics, feedback and tutorials so non-technical teams can actually find, understand and use workforce data.",
      technologies: [
        "WordPress",
        "Custom Gutenberg blocks",
        "PHP",
        "AWS Kendra",
        "AWS Lambda",
        "Tailwind CSS",
        "GA4",
        "GSC",
      ],
      links: [
        {
          type: "Digital Front Door",
          href: "https://healthworkforce.ca/digital-front-door/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Dashboards",
          href: "https://healthworkforce.ca/dashboards/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Modelling & Forecasting",
          href: "https://healthworkforce.ca/modelling-and-forecasting/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Health Workforce Canada – Resource Library & Content Patterns",
      href: "https://healthworkforce.ca",
      dates: "2024 – 2025",
      active: true,
      description:
        "Designed and implemented Gutenberg-based content patterns for resource hubs, FAQs, explainers and tutorials. Focused on accessible typography, consistent layouts and reusable blocks so policy, research and comms teams can publish complex workforce content without needing a developer every time.",
      technologies: [
        "WordPress",
        "Custom Gutenberg blocks",
        "block.json",
        "SCSS",
        "Accessibility",
      ],
      links: [
        {
          type: "Website",
          href: "https://healthworkforce.ca",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Plurilock Security – Marketing Site & Dashboards",
      href: "https://plurilock.com",
      dates: "2022",
      active: false,
      description:
        "Maintained and extended Plurilock’s WordPress marketing site and related dashboard/reporting views. Delivered new templates and landing pages for product and investor content, refactored legacy CSS/JS, improved performance and stability, and supported marketing campaigns without breaking core conversion funnels.",
      technologies: ["WordPress", "PHP", "JavaScript", "CSS", "WP Engine"],
      links: [
        {
          type: "Website",
          href: "https://plurilock.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Aurora IT – Security Services Web Platform",
      href: "#",
      dates: "2023 – 2024",
      active: true,
      description:
        "Web experience for a security and IT services provider, focused on clearly explaining complex offerings to non-technical buyers. Defined page structure, service landing templates and a reusable component system so new pages can be shipped quickly while staying on-brand and performance-friendly.",
      technologies: [
        "WordPress",
        "Next.js",
        "Tailwind CSS",
        "SEO",
        "GA4",
        "GTM",
      ],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Stratomer IT – Core Site & SEO Foundation",
      href: "https://stratomerit.com",
      dates: "2023 – 2025",
      active: true,
      description:
        "Planned and executed the main Stratomer IT website for cloud, networking and security services. Structured information architecture, implemented SEO-first templates, integrated GA4, GSC and Tag Manager, and optimized performance so paid and organic traffic both land on fast, clear pages.",
      technologies: ["WordPress", "Elementor", "SEO", "GA4", "GSC", "GTM"],
      links: [
        {
          type: "Website",
          href: "https://stratomerit.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Stratomer IT – Lead Gen Landing Page System",
      href: "#",
      dates: "2023 – 2024",
      active: true,
      description:
        "A system of reusable landing page templates for campaigns around security assessments, cloud migrations and managed services. Built with modular sections, integrated forms and tracking pixels so marketing can spin up, clone and A/B test pages without developer involvement.",
      technologies: ["WordPress", "Landing pages", "SEO", "GA4", "GTM"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Multi-Clinic Healthcare Websites",
      href: "#",
      dates: "2021 – 2024",
      active: true,
      description:
        "Designed and developed WordPress sites for medical clinics and healthcare groups, focusing on accessibility, clear appointment flows and mobile performance. Implemented booking/forms integrations, location-based pages and SEO foundations so clinics show up where patients actually search.",
      technologies: [
        "WordPress",
        "Gutenberg / Elementor",
        "Forms",
        "SEO",
        "Performance",
      ],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "WordPress Editor Toolkit – Blocks, Tours & Health Checks",
      href: "#",
      dates: "2022 – 2025",
      active: true,
      description:
        "Internal toolkit used across sites: guided tours for complex dashboards and flows, reusable Gutenberg patterns for FAQs and explainers, and quick health checks for analytics and forms. Built to reduce handholding and support tickets by giving editors obvious, repeatable ways to publish and understand changes.",
      technologies: [
        "WordPress",
        "Custom Gutenberg blocks",
        "PHP",
        "JavaScript",
        "SCSS",
      ],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "SMTP & DNS Health Monitor",
      href: "#",
      dates: "2023 – 2024",
      active: true,
      description:
        "Lightweight WordPress utility that surfaces SMTP and DNS status inside the admin: test emails, SPF/DKIM/DMARC checks and simple traffic-light indicators for common misconfigurations. Used when bringing new domains online or debugging why contact forms and notifications are not reaching inboxes.",
      technologies: ["WordPress", "PHP", "DNS", "SMTP"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Analytics Snapshot Dashboard Widget",
      href: "#",
      dates: "2023 – 2025",
      active: true,
      description:
        "Custom dashboard widget that pulls high-level metrics from GA4 and Search Console into WordPress. Shows traffic trends, top content and key search queries so content, comms and leadership can see what’s working without logging into full analytics tools.",
      technologies: [
        "WordPress",
        "PHP",
        "GA4",
        "Google Search Console",
        "REST APIs",
      ],
      links: [],
      image: "",
      video: "",
    },
  ],


  hackathons: [],
} as const;
