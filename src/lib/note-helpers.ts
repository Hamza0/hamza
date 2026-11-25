export type ErrorExample = {
  title: string;
  code: string;
  detail: string;
  kind: "neutral" | "warning";
};

export type NoteStarter = { label: string; message: string };

const starters: Record<string, readonly NoteStarter[]> = {
  "shopify-discount-code-not-working": [{"label":"Discount code invalid","message":"My Shopify store says my discount code is invalid."}, {"label":"Discount not applying","message":"Customers are not receiving the advertised discount."}, {"label":"Urgent: sale affected","message":"I have an active promotion and customers are having trouble checking out."}],
  "elementor-editor-not-loading": [{"label":"Editor keeps loading","message":"My Elementor editor is stuck on the loading screen."}, {"label":"Blank editor","message":"I see a blank or gray screen when editing a WordPress page."}, {"label":"After an update","message":"Elementor stopped working after I updated WordPress or a plugin."}],
  "google-business-profile-suspended": [{"label":"Profile suspended","message":"Google has suspended my business profile."}, {"label":"Appeal help","message":"I need help understanding the reason for my Google Business Profile suspension."}, {"label":"Listing disappeared","message":"My customers can no longer find my business listing after a restriction."}],
  "gmail-rejecting-business-email-550-5-7-26": [{"label":"Gmail rejects email","message":"My business emails to Gmail addresses are being rejected."}, {"label":"550 5.7.26 error","message":"My email bounce message contains error 550 5.7.26."}, {"label":"Missing customer emails","message":"Customers are not receiving my invoices, confirmations or replies."}],
  "lovable-custom-domain-not-working": [{"label":"Domain not connecting","message":"My custom domain is not connecting to my Lovable app."}, {"label":"Stuck setting up domain","message":"My Lovable domain setup is not completing."}, {"label":"Live app shows error","message":"My app works at its preview or default address but not on my own domain."}],
  "fix-existing-website-without-rebuild": [
    {
      "label": "Website not working",
      "message": "My website has suddenly stopped working."
    },
    {
      "label": "Customers see errors",
      "message": "My customers are getting an error."
    },
    {
      "label": "Fix existing website",
      "message": "I need help fixing something on my existing website."
    }
  ],
  "fix-existing-lovable-app": [
    {
      "label": "Broken app feature",
      "message": "I built an app with Lovable and a feature is not working."
    },
    {
      "label": "Preview works, live fails",
      "message": "My AI-built app works in preview but not when published."
    },
    {
      "label": "Improve existing app",
      "message": "I need someone to improve an app I already built."
    }
  ],
  "website-developer-stopped-responding": [
    {
      "label": "Developer unavailable",
      "message": "My web developer is no longer responding."
    },
    {
      "label": "Website handover",
      "message": "I need help taking over an existing website."
    },
    {
      "label": "Need website changes",
      "message": "I can access my site but cannot make the changes I need."
    }
  ],
  "wordpress-critical-error-help": [
    {
      "label": "Critical error",
      "message": "My WordPress website shows a critical error."
    },
    {
      "label": "Broken after update",
      "message": "My website stopped working after a plugin update."
    },
    {
      "label": "Urgent: site down",
      "message": "This is urgent. My WordPress website is down."
    }
  ],
  "customers-cannot-log-into-web-app": [
    {
      "label": "Login not working",
      "message": "My customers cannot log into my app."
    },
    {
      "label": "Password reset issue",
      "message": "Password reset emails are not arriving."
    },
    {
      "label": "Login loop",
      "message": "Customers keep returning to the login screen."
    }
  ],
  "website-booking-no-available-times": [
    {
      "label": "No available times",
      "message": "My calendar has free time but customers cannot book."
    },
    {
      "label": "Booking form issue",
      "message": "My appointment booking form is not working."
    },
    {
      "label": "Cannot finish booking",
      "message": "Customers cannot complete an appointment booking."
    }
  ],
  "wordpress-form-sent-but-no-email": [
    {
      "label": "Emails not arriving",
      "message": "My website form says sent but I never receive the email."
    },
    {
      "label": "Missing enquiries",
      "message": "My business is missing customer enquiries."
    },
    {
      "label": "Check contact form",
      "message": "I need help checking my website’s contact form."
    }
  ],
  "woocommerce-payment-succeeded-order-pending": [
    {
      "label": "Order stuck pending",
      "message": "My customer paid but WooCommerce shows the order as pending."
    },
    {
      "label": "Payment without order",
      "message": "Payment was received but no order was created."
    },
    {
      "label": "Payment and order mismatch",
      "message": "I need to check whether payments and orders match."
    }
  ],
  "woocommerce-payment-methods-missing": [
    {
      "label": "No payment options",
      "message": "My customers cannot see payment options at checkout."
    },
    {
      "label": "Card payments missing",
      "message": "My card payment option suddenly disappeared."
    },
    {
      "label": "Urgent: payments blocked",
      "message": "This is urgent. My store cannot accept payments."
    }
  ],
  "woocommerce-no-shipping-options": [
    {
      "label": "No shipping options",
      "message": "My customers cannot select shipping at checkout."
    },
    {
      "label": "Shipping error",
      "message": "WooCommerce says no shipping options are available."
    },
    {
      "label": "Some regions affected",
      "message": "Customers in certain areas cannot complete an order."
    }
  ],
  "wordpress-slow-after-update": [
    {
      "label": "Slow after update",
      "message": "My WordPress website became slow after an update."
    },
    {
      "label": "Slow on mobile",
      "message": "My website is very slow on mobile."
    },
    {
      "label": "Find performance issue",
      "message": "I need help finding what is making my website slow."
    }
  ],
  "website-crm-sync-stopped": [
    {
      "label": "Missing leads",
      "message": "My website stopped sending leads to my CRM."
    },
    {
      "label": "Sync stopped",
      "message": "My business tools are not syncing anymore."
    },
    {
      "label": "Missing records",
      "message": "Records are missing from one of my systems."
    }
  ],
  "website-changes-not-showing": [
    {
      "label": "Old website version",
      "message": "I changed my website but customers still see the old version."
    },
    {
      "label": "Visitors see old content",
      "message": "My changes show when I am logged in but not for visitors."
    },
    {
      "label": "Update not appearing",
      "message": "I need help getting my website update to appear."
    }
  ],
  "moving-website-keep-email-working": [
    {
      "label": "Move website safely",
      "message": "I need to move my website without losing my email."
    },
    {
      "label": "Email stopped working",
      "message": "My business email stopped working after a domain change."
    },
    {
      "label": "Changing hosting",
      "message": "I am changing hosting and want to avoid interruptions."
    }
  ],
  "google-business-profile-not-showing-maps": [
    {
      "label": "Missing from Maps",
      "message": "My Google business listing is missing from Maps."
    },
    {
      "label": "Business not found",
      "message": "Customers cannot find my business on Google."
    },
    {
      "label": "Check listing visibility",
      "message": "I need help understanding why my listing is not visible."
    }
  ],
  "google-crawled-page-not-indexed": [
    {
      "label": "Page not indexed",
      "message": "Google is not indexing an important page on my website."
    },
    {
      "label": "Crawled, not indexed",
      "message": "Search Console says crawled but currently not indexed."
    },
    {
      "label": "Missing from search",
      "message": "I need help understanding why my website is missing from search."
    }
  ],
  "website-redesign-google-traffic-drop": [
    {
      "label": "Traffic dropped",
      "message": "My Google traffic dropped after a website redesign."
    },
    {
      "label": "Old pages missing",
      "message": "My old pages no longer appear in Google."
    },
    {
      "label": "Check search visibility",
      "message": "I need to understand what happened to my search visibility."
    }
  ],
  "customer-data-access-after-login": [
    {
      "label": "Portal access review",
      "message": "I need help checking access to my customer portal."
    },
    {
      "label": "Wrong customer data",
      "message": "Customers are seeing information they should not see."
    },
    {
      "label": "App permissions",
      "message": "I want to review the permissions in my existing app."
    }
  ],
  "ai-chatbot-wrong-answers": [
    {
      "label": "Wrong chatbot answers",
      "message": "My website chatbot keeps giving customers wrong answers."
    },
    {
      "label": "Wrong business information",
      "message": "My chatbot is not using the right business information."
    },
    {
      "label": "Improve AI tool",
      "message": "I need to improve the reliability of an existing AI tool."
    }
  ],
  "spreadsheet-or-custom-web-app": [
    {
      "label": "Too many spreadsheets",
      "message": "My team is struggling to manage everything in a spreadsheet."
    },
    {
      "label": "Manual business process",
      "message": "I need to improve a manual process in my business."
    },
    {
      "label": "Improve existing tool",
      "message": "I have an existing tool and need it to work better."
    }
  ],
  "french-page-opens-in-english": [
    {
      "label": "Wrong page language",
      "message": "My French website opens the English page instead."
    },
    {
      "label": "Language switcher broken",
      "message": "The language switcher on my website is not working."
    },
    {
      "label": "Fix translations",
      "message": "I need help correcting my translated website."
    }
  ],
  "google-product-price-mismatch": [
    {
      "label": "Wrong Google price",
      "message": "Google shows the wrong price for my products."
    },
    {
      "label": "Price mismatch",
      "message": "My product price on Google does not match my store."
    },
    {
      "label": "Product listing errors",
      "message": "I need help finding the cause of my product listing errors."
    }
  ],
  "why-google-shows-old-website-text": [
    {
      "label": "Old search result",
      "message": "Google still shows the old text from my website."
    },
    {
      "label": "Google missed update",
      "message": "I updated my site but Google has not picked up the changes."
    },
    {
      "label": "Check Google visibility",
      "message": "I need help checking what Google sees."
    }
  ],
  "website-connection-not-private": [
    {
      "label": "SSL warning",
      "message": "My website shows a connection is not private warning."
    },
    {
      "label": "Customers blocked",
      "message": "Customers cannot open my website because of an SSL error."
    },
    {
      "label": "Urgent security warning",
      "message": "This is urgent. My website shows a security warning."
    }
  ],
  "website-dns-site-cant-be-reached": [
    {
      "label": "Website unreachable",
      "message": "My website says this site can’t be reached."
    },
    {
      "label": "After domain change",
      "message": "My website stopped opening after I changed my domain settings."
    },
    {
      "label": "Urgent: site down",
      "message": "My website is down and I need help as soon as possible."
    }
  ],
  "website-too-many-redirects": [
    {
      "label": "Redirect loop",
      "message": "My website shows ERR_TOO_MANY_REDIRECTS."
    },
    {
      "label": "After enabling HTTPS",
      "message": "My website stopped working after I enabled HTTPS."
    },
    {
      "label": "Stuck at login",
      "message": "Customers keep getting sent back to the login page."
    }
  ],
  "cloudflare-error-522-website-down": [
    {
      "label": "Cloudflare 522",
      "message": "My website is showing Cloudflare error 522."
    },
    {
      "label": "Intermittent downtime",
      "message": "My website keeps going offline when customers visit."
    },
    {
      "label": "Urgent: site down",
      "message": "This is urgent. My entire website is currently unavailable."
    }
  ],
  "shopify-checkout-payment-not-working": [
    {
      "label": "Payments failing",
      "message": "My Shopify customers cannot complete their payments."
    },
    {
      "label": "Checkout blocked",
      "message": "Customers can add products to the cart but checkout fails."
    },
    {
      "label": "Urgent: lost orders",
      "message": "This is urgent. My store is losing orders because checkout is not working."
    }
  ],
  "google-dangerous-site-warning": [
    {
      "label": "Google security warning",
      "message": "Google is showing a dangerous site warning for my website."
    },
    {
      "label": "Unexpected redirects",
      "message": "My website redirects visitors somewhere I do not recognize."
    },
    {
      "label": "Suspected compromise",
      "message": "This is urgent. I suspect my business website has been compromised."
    }
  ]
};

const examples: Record<string, ErrorExample> = {
  "shopify-discount-code-not-working": {"title":"Discount code not accepted","code":"Discount code isn't valid for the items in your cart","detail":"The cart may not meet the conditions for the promotion.","kind":"neutral"},
  "elementor-editor-not-loading": {"title":"Elementor editor is loading","code":"Editor does not finish loading","detail":"The public page may still work even when the editing screen does not.","kind":"neutral"},
  "google-business-profile-suspended": {"title":"Business Profile suspended","code":"Profile restricted or disabled","detail":"Check the reason for the restriction in your Google account.","kind":"warning"},
  "gmail-rejecting-business-email-550-5-7-26": {"title":"Message blocked","code":"550 5.7.26","detail":"Gmail could not authenticate the sender or rejected the message under its authentication rules.","kind":"warning"},
  "lovable-custom-domain-not-working": {"title":"Setting up domain","code":"Domain setup pending","detail":"Domain records, verification or the certificate may still need attention.","kind":"neutral"},
  "website-connection-not-private": {
    "title": "Your connection is not private",
    "code": "NET::ERR_CERT_DATE_INVALID",
    "detail": "The browser could not verify a secure connection.",
    "kind": "warning"
  },
  "website-dns-site-cant-be-reached": {
    "title": "This site can’t be reached",
    "code": "DNS_PROBE_FINISHED_NXDOMAIN",
    "detail": "The website address could not be found.",
    "kind": "neutral"
  },
  "website-too-many-redirects": {
    "title": "This page isn’t working",
    "code": "ERR_TOO_MANY_REDIRECTS",
    "detail": "The page redirected too many times.",
    "kind": "neutral"
  },
  "cloudflare-error-522-website-down": {
    "title": "Connection timed out",
    "code": "Error code 522",
    "detail": "Cloudflare could not complete a connection to the website’s server.",
    "kind": "neutral"
  },
  "shopify-checkout-payment-not-working": {
    "title": "Payment could not be completed",
    "code": "There was an issue processing your payment",
    "detail": "A checkout may fail for more than one reason.",
    "kind": "warning"
  },
  "google-dangerous-site-warning": {
    "title": "Dangerous site",
    "code": "Google Safe Browsing warning",
    "detail": "Visitors may be warned about harmful or deceptive content.",
    "kind": "warning"
  },
  "wordpress-critical-error-help": {
    "title": "There has been a critical error on this website.",
    "code": "WordPress critical error",
    "detail": "WordPress was unable to complete the request.",
    "kind": "neutral"
  },
  "woocommerce-no-shipping-options": {
    "title": "No shipping options are available",
    "code": "WooCommerce checkout",
    "detail": "The customer cannot select delivery for this order.",
    "kind": "neutral"
  }
};

const defaults: readonly NoteStarter[] = [
  { label: "Website help", message: "I need help with something on my website." },
  { label: "Existing app", message: "I have an existing app that needs some changes." },
  { label: "Business process", message: "I want to understand how to improve a business process." },
];

export function hasContextualStarters(slug: string): boolean {
  return Object.hasOwn(starters, slug);
}

export function getNoteStarters(slug: string): readonly NoteStarter[] {
  return starters[slug] ?? defaults;
}

export function getErrorExample(slug: string): ErrorExample | undefined {
  return examples[slug];
}
