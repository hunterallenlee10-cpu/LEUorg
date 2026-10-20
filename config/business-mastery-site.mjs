/**
 * Where Business Mastery lives on this site. This repo is the .org site
 * (www.leeenterprisesunlimited.org), a separate copy of the .net site, so it
 * has its own copy of the page. Its subdomain would be
 * mastery.leeenterprisesunlimited.org, served by this same project.
 * docs/BUSINESS-MASTERY.md has the whole arrangement.
 *
 * next.config.mjs answers that host with the /business-mastery page at its
 * root and sends every other page on it back to the www host. Those host rules
 * are always on: until the subdomain is attached in Vercel, no request ever
 * arrives on it, so they do nothing.
 *
 * `BUSINESS_MASTERY_SITE_LIVE` is the switch for everything else: the links
 * across the site, the page's canonical address, the sitemap entry and the
 * www /business-mastery redirect. While it is off they all use
 * www.leeenterprisesunlimited.org/business-mastery. Flip it to true only once
 * https://mastery.leeenterprisesunlimited.org shows the Business Mastery page,
 * or every one of those would point at an address that does not answer yet.
 *
 * A plain JavaScript module rather than TypeScript because next.config.mjs
 * imports it and cannot import TypeScript; the app imports it too.
 */
export const BUSINESS_MASTERY_HOST = "mastery.leeenterprisesunlimited.org";

/** The subdomain's origin, no trailing slash. */
export const BUSINESS_MASTERY_SITE_URL = `https://${BUSINESS_MASTERY_HOST}`;

/**
 * Off: mastery.leeenterprisesunlimited.org is not attached to this project in
 * Vercel yet (it answered DEPLOYMENT_NOT_FOUND on 2026-10-20). Attach it, check
 * it shows the Business Mastery page, then flip this to true.
 * @type {boolean}
 */
export const BUSINESS_MASTERY_SITE_LIVE = false;
