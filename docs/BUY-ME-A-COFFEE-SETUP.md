# Buy Me a Coffee setup (2 minutes)

OpenRobots ships with a built-in Buy Me a Coffee button, but it stays **completely hidden until you configure it** — the site never shows a dead or generic donation link.

## 1. Get your username

Create (or log into) an account at [buymeacoffee.com](https://www.buymeacoffee.com) and note your **username** — the part after `buymeacoffee.com/` in your page URL. For example, if your page is `https://www.buymeacoffee.com/openrobots`, your username is `openrobots`.

## 2. Local development

Add the slug to `.env.local` in the project root:

```
NEXT_PUBLIC_BMC_SLUG=openrobots
```

Restart `npm run dev` — the button appears in the footer's Support section and as an inline link under the tool output.

## 3. Production (Vercel)

```bash
vercel env add NEXT_PUBLIC_BMC_SLUG production
# paste your username when prompted, then:
vercel --prod --yes
```

(Or add it in the Vercel dashboard: Project → Settings → Environment Variables.)

## 4. Where the button appears

- **Footer** — "Support" column, with a short warm blurb.
- **Below the tool output** — a small inline "☕ Buy us a coffee" text link.
- **Support band** — a "Keep OpenRobots free" section near the bottom of the page.

## Alternative platforms (comparison)

Buy Me a Coffee charges a **5% fee** on payouts (plus payment processing). If you'd rather keep more of every donation:

- **Ko-fi** — 0% platform fee on donations (payment processing still applies). Free tier includes a button; you can point it at your Ko-fi page.
- **GitHub Sponsors** — 0% platform fee for personal accounts; fees are waived for the platform, so supporters pay only card processing.

The integration is deliberately tiny: `<components/BuyMeACoffee.tsx>` is a single server component that renders `null` unless a slug env var is set. Duplicating it for Ko-fi or GitHub Sponsors is a ~10-line change — swap the URL/image and the env var name.
