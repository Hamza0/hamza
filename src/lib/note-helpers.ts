export type ErrorExample = {
  title: string;
  code: string;
  detail: string;
  kind: "neutral" | "warning";
};

const starters: Record<string, readonly string[]> = {
  "fix-existing-website-without-rebuild": [
    "My website has suddenly stopped working.",
    "My customers are getting an error.",
    "I need help fixing something on my existing website."
  ],
  "fix-existing-lovable-app": [
    "I built an app with Lovable and a feature is not working.",
    "My AI-built app works in preview but not when published.",
    "I need someone to improve an app I already built."
  ],
  "website-developer-stopped-responding": [
    "My web developer is no longer responding.",
    "I need help taking over an existing website.",
    "I can access my site but cannot make the changes I need."
  ],
  "wordpress-critical-error-help": [
    "My WordPress website shows a critical error.",
    "My website stopped working after a plugin update.",
    "This is urgent. My WordPress website is down."
  ],
  "customers-cannot-log-into-web-app": [
    "My customers cannot log into my app.",
    "Password reset emails are not arriving.",
    "Customers keep returning to the login screen."
  ],
  "website-booking-no-available-times": [
    "My calendar has free time but customers cannot book.",
    "My appointment booking form is not working.",
    "Customers cannot complete an appointment booking."
  ],
  "wordpress-form-sent-but-no-email": [
    "My website form says sent but I never receive the email.",
    "My business is missing customer enquiries.",
    "I need help checking my website’s contact form."
  ],
  "woocommerce-payment-succeeded-order-pending": [
    "My customer paid but WooCommerce shows the order as pending.",
    "Payment was received but no order was created.",
    "I need to check whether payments and orders match."
  ],
  "woocommerce-payment-methods-missing": [
    "My customers cannot see payment options at checkout.",
    "My card payment option suddenly disappeared.",
    "This is urgent. My store cannot accept payments."
  ],
  "woocommerce-no-shipping-options": [
    "My customers cannot select shipping at checkout.",
    "WooCommerce says no shipping options are available.",
    "Customers in certain areas cannot complete an order."
  ],
  "wordpress-slow-after-update": [
    "My WordPress website became slow after an update.",
    "My website is very slow on mobile.",
    "I need help finding what is making my website slow."
  ],
  "website-crm-sync-stopped": [
    "My website stopped sending leads to my CRM.",
    "My business tools are not syncing anymore.",
    "Records are missing from one of my systems."
  ],
  "website-changes-not-showing": [
    "I changed my website but customers still see the old version.",
    "My changes show when I am logged in but not for visitors.",
    "I need help getting my website update to appear."
  ],
  "moving-website-keep-email-working": [
    "I need to move my website without losing my email.",
    "My business email stopped working after a domain change.",
    "I am changing hosting and want to avoid interruptions."
  ],
  "google-business-profile-not-showing-maps": [
    "My Google business listing is missing from Maps.",
    "Customers cannot find my business on Google.",
    "I need help understanding why my listing is not visible."
  ],
  "google-crawled-page-not-indexed": [
    "Google is not indexing an important page on my website.",
    "Search Console says crawled but currently not indexed.",
    "I need help understanding why my website is missing from search."
  ],
  "website-redesign-google-traffic-drop": [
    "My Google traffic dropped after a website redesign.",
    "My old pages no longer appear in Google.",
    "I need to understand what happened to my search visibility."
  ],
  "customer-data-access-after-login": [
    "I need help checking access to my customer portal.",
    "Customers are seeing information they should not see.",
    "I want to review the permissions in my existing app."
  ],
  "ai-chatbot-wrong-answers": [
    "My website chatbot keeps giving customers wrong answers.",
    "My chatbot is not using the right business information.",
    "I need to improve the reliability of an existing AI tool."
  ],
  "spreadsheet-or-custom-web-app": [
    "My team is struggling to manage everything in a spreadsheet.",
    "I need to improve a manual process in my business.",
    "I have an existing tool and need it to work better."
  ],
  "french-page-opens-in-english": [
    "My French website opens the English page instead.",
    "The language switcher on my website is not working.",
    "I need help correcting my translated website."
  ],
  "google-product-price-mismatch": [
    "Google shows the wrong price for my products.",
    "My product price on Google does not match my store.",
    "I need help finding the cause of my product listing errors."
  ],
  "why-google-shows-old-website-text": [
    "Google still shows the old text from my website.",
    "I updated my site but Google has not picked up the changes.",
    "I need help checking what Google sees."
  ],
  "website-connection-not-private": [
    "My website shows a connection is not private warning.",
    "Customers cannot open my website because of an SSL error.",
    "This is urgent. My website shows a security warning."
  ],
  "website-dns-site-cant-be-reached": [
    "My website says this site can’t be reached.",
    "My website stopped opening after I changed my domain settings.",
    "My website is down and I need help as soon as possible."
  ],
  "website-too-many-redirects": [
    "My website shows ERR_TOO_MANY_REDIRECTS.",
    "My website stopped working after I enabled HTTPS.",
    "Customers keep getting sent back to the login page."
  ],
  "cloudflare-error-522-website-down": [
    "My website is showing Cloudflare error 522.",
    "My website keeps going offline when customers visit.",
    "This is urgent. My entire website is currently unavailable."
  ],
  "shopify-checkout-payment-not-working": [
    "My Shopify customers cannot complete their payments.",
    "Customers can add products to the cart but checkout fails.",
    "This is urgent. My store is losing orders because checkout is not working."
  ],
  "google-dangerous-site-warning": [
    "Google is showing a dangerous site warning for my website.",
    "My website redirects visitors somewhere I do not recognize.",
    "This is urgent. I suspect my business website has been compromised."
  ]
};

const examples: Record<string, ErrorExample> = {
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

const defaults = [
  "I need help with something on my website.",
  "I have an existing app that needs some changes.",
  "I want to understand how to improve a business process.",
] as const;

export function getNoteStarters(slug: string): readonly string[] {
  return starters[slug] ?? defaults;
}

export function getErrorExample(slug: string): ErrorExample | undefined {
  return examples[slug];
}
