import { redirect } from "next/navigation";
import { bookHref } from "@/data/site";

/**
 * leeenterprisesunlimited.org/book, the short address to print or say out
 * loud. It forwards to wherever "Book a free call" goes (data/site.ts): the
 * booking page once one is set, the contact form with LEU picked
 * until then. A temporary redirect on purpose, because that destination is
 * expected to change. Left out of the sitemap.
 */
export default function BookPage() {
  redirect(bookHref);
}
