import { site } from "@/data/site";

/**
 * The site's own origin, no trailing slash: the www host, which the bare
 * domain redirects to. Canonical links, share cards, the sitemap and
 * structured data are all built from it. It lives in data/site.ts with the
 * other business facts.
 */
export const SITE_URL = site.url;

export const companyInfo = {
  name: site.name,
  logoAlt: "Lee Enterprises Unlimited logo",
  /**
   * The LEU monogram without the name lettered under it, for the header,
   * where the full name is set as text right beside it. 164x160, silver
   * (the owner's new logo, 2026-10-18, with the university.com colours).
   */
  mark: "/logos/leu-mark.webp",
  contactEmail: site.email,
};

export const footerContent = {
  /** The owner's wording (2026-09-28): the founding year, fixed, in place of
   * the current year. */
  copyright: "© Est. 2024 Lee Enterprises Unlimited. All rights reserved.",
  links: [
    { label: "Privacy policy", href: "/legal#privacy" },
    { label: "Terms of service", href: "/legal#terms" },
  ],
};

export const privacyPolicyContent = {
  title: "Privacy Policy",
  sections: [
    {
      heading: "Introduction",
      content:
        "Lee Enterprises Unlimited is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.",
    },
    {
      heading: "Information We Collect",
      content:
        "We may collect information about you in a variety of ways. The information we may collect on the site includes your name, email address, phone number, and any other information you voluntarily provide through our contact forms.",
    },
    {
      heading: "Use of Your Information",
      content:
        "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to respond to your inquiries, process your requests, and send you marketing communications if you have opted in.",
    },
    {
      heading: "Disclosure of Your Information",
      content:
        "We do not sell, trade, or rent your personal information to third parties. We may disclose your information when we believe disclosure is in your best interest to comply with the law.",
    },
  ],
};

export const termsOfServiceContent = {
  title: "Terms of Service",
  sections: [
    {
      heading: "Agreement to Terms",
      content:
        "By accessing and using this website, you accept and agree to be bound by and comply with these terms and conditions.",
    },
    {
      heading: "Intellectual Property Rights",
      content:
        "Unless otherwise stated, Lee Enterprises Unlimited and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access this for your personal use subject to restrictions set in these terms and conditions.",
    },
    {
      heading: "User Responsibilities",
      content:
        "You warrant and represent that your use of the site will be consistent with these Terms and will not violate any applicable law or regulation, nor will it infringe the rights of any third party.",
    },
    {
      heading: "Limitation of Liability",
      content:
        "In no event shall Lee Enterprises Unlimited, nor any of its officers, directors and employees, be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special or consequential loss, or for any business losses, loss of revenue or income.",
    },
  ],
};
