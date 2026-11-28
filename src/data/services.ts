export const services = [
  {
    slug: "website-repair-toronto",
    title: "Website repair in Toronto",
    description: "Get help with a broken website, missed enquiries or a failing Shopify checkout. Work directly with Hamza Shakeel on the repair your Toronto business needs.",
    intro: "If your Toronto business has stopped receiving quote requests or customers can’t finish an order, send me the page where it happens. I’ll help you work out what broke and what it would take to get that part of the site working again.",
    areas: ["Toronto"],
    heading: "Where does the customer get stuck?",
    sections: [
      { title: "The form says “sent” but nobody hears back", body: "I follow a test enquiry from the form to the inbox or CRM. Whether the entry was saved, the notification was sent, or your team received it determines which part needs attention." },
      { title: "Shoppers can’t complete an order", body: "For Shopify troubleshooting, one failing basket is a useful starting point. A missing delivery option, a discount rejected at checkout and a declined payment each need a different check. Share the product, the step and the exact message you see." },
      { title: "The public site broke after a change", body: "Tell me when it last worked and whether the issue affects one page or the whole site. I’ll compare the affected journey with a working one and agree on a repair you can test before it goes live. The final check is the original task, such as a quote reaching its intended inbox." },
    ],
    link: { path: "/blog/fix-existing-website-without-rebuild", label: "How I decide whether an existing website can be repaired" },
    action: "Ask about a website repair",
    prompt: "Include the public URL, what a customer was trying to do and when it last worked.",
    starters: [
      { label: "Missing enquiries", message: "Customers submit our form, but we don’t receive their enquiries." },
      { label: "Checkout problem", message: "Customers are getting stuck during checkout on our store." },
    ],
  },
  {
    slug: "wordpress-development-toronto-mississauga",
    title: "WordPress development in Toronto and Mississauga",
    description: "WordPress development for Toronto and Mississauga businesses. Build editable pages, improve an Elementor site or adapt WooCommerce to the way you sell.",
    intro: "Tell me what your customers need to do and who will update the site after launch. I build and extend WordPress sites for Toronto and Mississauga businesses, from a service page your staff can edit to a store with different rules for pickup and delivery.",
    areas: ["Toronto", "Mississauga"],
    heading: "What needs to change in WordPress?",
    sections: [
      { title: "Give editors a reusable page", body: "If adding a service means copying an old page and fixing its spacing by hand, I can build a template with fields for the details that actually vary. We can try it with your longest service name and a real photo, then have an editor publish a sample." },
      { title: "Make an Elementor layout easier to maintain", body: "A header change that fixes one page can shift every page using the same template. I check which layouts share the affected widget, work on a staging copy and review the mobile view alongside the editor before publishing." },
      { title: "Fit WooCommerce to your delivery rules", body: "A store offering local pickup and shipping needs a clear result for each basket. We can map your products, destinations and thresholds to the checkout options you intend, then test an eligible order and one just outside the delivery area." },
    ],
    link: { path: "/blog/elementor-editor-not-loading", label: "What to check when Elementor stops loading" },
    action: "Discuss a WordPress project",
    prompt: "Describe the page, editing task or store change you need. An example from your current site helps.",
    starters: [
      { label: "New page template", message: "We need a WordPress page template our team can update." },
      { label: "Store changes", message: "We need to change how our WooCommerce store handles orders." },
    ],
  },
  {
    slug: "existing-web-application-development-support",
    title: "Existing web application development and support",
    description: "Extend an existing web app or fix a workflow that keeps failing. Get help with Lovable, React, Supabase and the systems your team already relies on.",
    intro: "If your team already runs the business on an app, the next feature has to fit the work people do today. I can take over a defined piece of an existing application, investigate a recurring failure or help move a Lovable prototype into everyday use.",
    areas: ["Greater Toronto Area"],
    heading: "Start with one workflow",
    sections: [
      { title: "Take over an existing codebase", body: "We start with the running version, its source repository and the path from a code change to a release. Pick one task, such as booking an appointment. Together we define what the customer should see and what record staff should find afterward." },
      { title: "Find where an app loses the change", body: "If a Lovable or React screen says a record was saved but it disappears on refresh, I trace the save and the next read. For an app backed by Supabase, that includes checking which signed-in role is performing each action and whether the expected row is visible to that role." },
      { title: "Extend the workflow and hand it back", body: "For a feature such as an approval step, we agree on who can approve, what happens to existing records and how staff can recover an interrupted request. I’ll document what changed, how to check it after release and what the next maintainer needs to know." },
    ],
    link: { path: "/projects/production-operations-platform", label: "Read the production operations platform case study" },
    action: "Discuss your existing app",
    prompt: "Describe one workflow, who uses it and what you need to happen next. A public demo link is welcome.",
    starters: [
      { label: "Fix a workflow", message: "An existing workflow in our app fails for some users." },
      { label: "Extend our app", message: "We want to add a feature to the app our team already uses." },
    ],
  },
] as const;

export const servicePath = (service: typeof services[number]) => `/services/${service.slug}`;
