import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Mian Muhammad Hamza Shakeel",
  initials: "HS",
  url: "https://hamzashakeel.ca",
  location: "Mississauga, Ontario, Canada",
  locationLink: "https://www.google.com/maps/place/Mississauga,+ON",
  headline:
    "Full-Stack Engineer building data-driven systems and digital platforms.",
  description:
    "I work across web applications, analytics and forecasting, CRM integrations, databases, cloud infrastructure, and production delivery.",
  strengthsIntro:
    "Full-stack engineering and practical delivery, grounded in web development, data, accessibility, and digital design.",
  projectsTitle: "Selected Work",
  projectsIntro:
    "A selection of websites, applications, dashboards, data tools, content systems, and digital platforms I have built, supported, or improved.",

  summary:
    "I bring 7+ years of experience building and supporting websites, applications and digital systems across healthcare, cybersecurity, agencies and technology teams. My work spans full-stack development, databases, APIs, CRM integrations, dashboards, analytics and forecasting initiatives. I focus on building reliable systems that are clear for users, maintainable for teams and dependable in production.",
  avatarUrl: "/hamza-profile.png",

  skills: [
    "Full-Stack Development",
    "Data Analysis & Reporting",
    "Dashboards & KPI Reporting",
    "Forecasting & Modelling",
    "SQL / PostgreSQL / MySQL",
    "CRM & System Integrations",
    "React",
    "Next.js",
    "JavaScript / TypeScript",
    "WordPress",
    "REST APIs",
    "AWS",
    "Docker",
    "Salesforce",
    "HubSpot",
    "GA4",
    "Accessibility / WCAG / AODA",
    "SEO",
    "HTML/CSS",
    "PHP",
    "Production Troubleshooting & QA",
    "Digital Design",
    "Layout & Typography",
    "Adobe Creative Suite",
    "Canva",
    "Landing Pages",
    "Campaign Assets",
    "Email / Template Support",
    "Shopify",
    "Google Tag Manager",
  ],

  strengths: [
    {
      title: "Full-Stack Development",
      description:
        "Web applications and digital platforms across React, Next.js, WordPress, APIs and databases.",
    },
    {
      title: "Data & Reporting",
      description:
        "Dashboards, workforce data experiences, reporting, forecasting tools and data-quality workflows.",
    },
    {
      title: "Systems Integration",
      description:
        "APIs, CRM workflows, Salesforce, HubSpot, forms, search and connected digital services.",
    },
    {
      title: "Production Support",
      description:
        "Debugging across application code, hosting, cloud services, databases and production configuration.",
    },
    {
      title: "Accessibility",
      description:
        "Semantic interfaces, keyboard support, contrast, responsive behaviour and WCAG/AODA-aware delivery.",
    },
    {
      title: "Technical Delivery",
      description:
        "Turning business requirements into maintainable systems, documentation, testing and reliable releases.",
    },
  ],

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Notes" },
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
      company: "Sparked Digital",
      href: "https://sparkeddigital.ca/",
      badges: ["Agency", "Contract"],
      location: "Remote",
      title: "Full Stack Engineer, Contract",
      logoUrl: "/logos/Sparked-Logo.webp",
      start: "Apr 2026",
      end: "Present",
      description:
        "Contract Full Stack Engineer at Sparked Digital, an agency environment supporting client websites, WordPress development, migrations, production troubleshooting, hosting/server coordination, performance improvements, plugin and theme work, and ongoing technical delivery across client projects.",
    },
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
        "Developed and maintained public digital services for healthworkforce.ca, including the Digital Front Door, dashboard landing pages and data experiences, and the Modelling & Forecasting platform's web experience. Built accessible WordPress and Gutenberg interfaces that help teams find and use workforce information and planning tools. Implemented AWS Kendra and Lambda integrations for intelligent search, connected third-party APIs and plugins, and supported analytics, testing, accessibility, and data quality checks. Managed domain, DNS, and email configuration, and handled production troubleshooting and QA to keep these services reliable and maintainable.",
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
        "Developed public web experiences connecting the Digital Front Door, dashboards, workforce data, and Modelling & Forecasting tools. Built accessible WordPress and Gutenberg interfaces for exploring workforce information and planning resources, integrated AWS Kendra and Lambda for intelligent search, and connected APIs and analytics. Supported testing and data quality across these digital services so non-technical teams could find, understand, and use the tools.",
      technologies: [
        "WordPress",
        "Digital Front Door",
        "Dashboards",
        "Accessibility",
        "Gutenberg",
        "GA4",
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
      title: "Health Workforce Canada – The Pulse",
      href: "https://healthworkforce.ca/the-pulse/",
      dates: "2024 – 2025",
      active: true,
      description:
        "A public-facing newsletter and content experience for Health Workforce Canada, supporting structured article presentation, newsletter archive access, accessible page layouts, and sign-up flow support.",
      technologies: [
        "Newsletter",
        "Content System",
        "Accessibility",
        "WordPress",
        "Digital Communications",
      ],
      links: [
        {
          type: "View Work Sample",
          href: "https://healthworkforce.ca/the-pulse/",
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
        "Built reusable Gutenberg content patterns for resource hubs, FAQs, explainers, and tutorials. Focused on accessible typography, consistent spacing, and editor-friendly workflows so teams could update structured content without developer support.",
      technologies: [
        "WordPress",
        "Content System",
        "Accessibility",
        "Gutenberg",
        "Resource Pages",
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
        "Supported Plurilock’s marketing website and dashboard/reporting views in WordPress. Maintained structured content templates, improved brand consistency across pages, and collaborated with product, UX, and marketing teams on responsive updates.",
      technologies: [
        "WordPress",
        "Marketing Website",
        "Dashboards",
        "Brand Consistency",
        "PHP",
      ],
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
      href: "https://www.aurorait.com/",
      dates: "2023 – 2024",
      active: true,
      description:
        "Supported a marketing web platform for security and IT services, with service landing templates and reusable sections. Structured content for non-technical buyers, implemented responsive layouts, and integrated SEO and analytics foundations.",
      technologies: [
        "WordPress",
        "Landing Pages",
        "SEO",
        "GA4",
        "GTM",
        "Responsive Layout",
      ],
      links: [
        {
          type: "Visit Website",
          href: "https://www.aurorait.com/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Stratomer IT – Core Site & SEO Foundation",
      href: "https://stratomerit.com",
      dates: "2023 – 2025",
      active: true,
      description:
        "Built Stratomer IT’s core marketing website with SEO-first page structure, reusable templates, and integrated GA4, Search Console, and Tag Manager. Improved content hierarchy and responsive layouts for clearer service pages.",
      technologies: ["WordPress", "SEO", "GA4", "GTM", "Marketing Website"],
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
      href: "",
      dates: "2023 – 2024",
      active: true,
      description:
        "Built a reusable landing page system for lead generation around security assessments, cloud migrations, and managed services. Implemented modular sections, forms, and tracking so new pages could be launched with less developer dependency.",
      technologies: [
        "Landing Pages",
        "Lead Generation",
        "Forms",
        "GA4",
        "GTM",
        "Salesforce",
      ],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Multi-Clinic Healthcare Websites",
      href: "",
      dates: "2021 – 2024",
      active: true,
      description:
        "Built WordPress websites for medical clinics with accessible layouts, clear appointment flows, and mobile-first responsive pages. Supported content structure, forms integrations, and SEO for patient-facing service pages.",
      technologies: [
        "WordPress",
        "Accessibility",
        "Forms",
        "SEO",
        "Responsive Layout",
      ],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "WordPress Editor Toolkit – Blocks, Tours & Health Checks",
      href: "",
      dates: "2022 – 2025",
      active: true,
      description:
        "Internal toolkit with reusable Gutenberg patterns, guided editor tours, and content health checks. Built to improve publishing quality and give teams clearer, repeatable ways to maintain structured content.",
      technologies: [
        "WordPress",
        "Gutenberg",
        "Content System",
        "Editor Support",
        "QA",
      ],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "SMTP & DNS Health Monitor",
      href: "",
      dates: "2023 – 2024",
      active: true,
      description:
        "WordPress utility for checking email and DNS configuration during domain setup and site launches. Surfaces SPF, DKIM, and DMARC status with simple indicators to help troubleshoot form and notification delivery issues.",
      technologies: ["WordPress", "Email Deliverability", "DNS", "QA"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Analytics Snapshot Dashboard Widget",
      href: "",
      dates: "2023 – 2025",
      active: true,
      description:
        "Dashboard widget that surfaces GA4 and Search Console metrics inside WordPress. Provides a readable summary of traffic trends and top content so teams can review site performance without navigating full analytics platforms.",
      technologies: [
        "WordPress",
        "GA4",
        "Google Search Console",
        "Reporting",
        "APIs",
      ],
      links: [],
      image: "",
      video: "",
    },
  ],


  hackathons: [],
} as const;
