import { BMC_SLUG, bmcLink } from "@/lib/config";

/**
 * Buy Me a Coffee support component (server component, no client JS).
 *
 * Per contract §5:
 * - "button" variant: official BMC button image wrapped in a safe anchor.
 * - "text" variant: small inline text link for in-flow placements.
 * - Renders null when BMC_SLUG is not configured — never a dead link.
 * - The floating widget script is intentionally NOT loaded (out of MVP scope).
 */
export default function BuyMeACoffee({
  variant = "button",
}: {
  variant?: "button" | "text";
}) {
  if (!BMC_SLUG) return null;

  if (variant === "text") {
    return (
      <a
        href={bmcLink(BMC_SLUG)}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-800 hover:decoration-emerald-500"
      >
        ☕ Buy us a coffee
      </a>
    );
  }

  const buttonImageSrc =
    "https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=%E2%98%95&slug=" +
    encodeURIComponent(BMC_SLUG) +
    "&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff";

  return (
    <a
      href={bmcLink(BMC_SLUG)}
      target="_blank"
      rel="noopener"
      className="inline-block rounded-lg transition-opacity hover:opacity-90"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={buttonImageSrc}
        alt="Buy us a coffee"
        width={178}
        height={48}
        loading="lazy"
      />
    </a>
  );
}
