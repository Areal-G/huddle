Huddle
======

**Group scheduling without the email thread.** Propose a few times, share one link, and let everyone vote with no account needed.

* [Why Huddle](#why-huddle)
* [Features](#features)
* [Trying the demo](#trying-the-demo)
* [Self-hosting](#self-hosting)
* [Configuration](#configuration)
* [Contributing](#contributing)


Why Huddle
----------

Finding a time for a group meeting usually means a long email thread and someone keeping score by hand. Huddle turns that into one link: the organizer proposes dates or time slots, invitees mark each one *yes*, *if need be* or *no*, and the organizer finalizes the winner and sends calendar invites.

The people voting never need an account, and the people organizing get a proper workspace. Teams share **spaces** with members, roles and a home dashboard that tracks open polls, response rates and upcoming events.

It is a Next.js monorepo (web app, landing site, docs and email templates) that runs as a hosted service with Stripe billing, or self-hosted from a single Docker image.


Features
--------

### For invitees

* Open a link, pick your name or type a new one, and tap yes / if need be / no for each option.
* Times show up in your own time zone.
* On a phone the availability grid becomes a stacked list with large tap targets.
* The most popular option is highlighted as votes come in.

### For organizers

* Pick dates on a month grid or a week view, set a default duration and add per-day time slots.
* Privacy rules per poll: require email, hide names, hide votes until voted, comments, vote options.
* A responses view lists every participant with their full availability, so following up with the one person who said "no" to everything takes a click.
* Finalize the winner and Huddle creates an event and emails `.ics` invites to everyone.
* The events view groups upcoming, past and cancelled meetings by day.

### For teams

* A home dashboard with open polls, responses this week vs last, upcoming events, invite response rate and a recent-activity feed.
* Spaces with members, admin/member roles and seat limits; permissions (CASL) are enforced on the server and the client.
* Sign in with email OTP, Google, Microsoft or any OIDC provider, plus guest sessions.

### Integrations

* Calendar connections and Google Meet / Zoom / Teams / Webex links.
* Webhooks and a REST API with API keys.
* Email through React Email templates over SMTP or Amazon SES, sent via a queue.
* 16 locales via i18next.

Light and dark themes are both first-class, and the primary colour can be overridden so a self-hosted instance carries its own brand.


Trying the demo
---------------

Once it is running (see below), open `/login` and click **Try the demo**. You land in the *Northwind Studio* workspace as Alex Morgan, with 27 polls, 160+ participants, 580 votes, comments and 18 scheduled events, all dated relative to today.

The button only shows when `DEMO_LOGIN_ENABLED=true`, and the sign-in runs in a server action, so the demo password never reaches the browser. Open any poll's share link in a private window to see the invitee side.


Self-hosting
------------

You'll need Node.js 24, pnpm 12 (`corepack enable` picks up the pinned version) and Docker.

1. Clone and install:

   ```bash
   git clone <your-fork-url> huddle
   cd huddle
   pnpm install
   ```

2. Copy the sample env files and set `SECRET_PASSWORD` (`openssl rand -hex 32`):

   ```bash
   cp apps/web/.env.sample apps/web/.env
   cp packages/database/.env.sample packages/database/.env
   ```

3. Start the local services. This brings up Postgres (port 5450), Redis, a Redis REST proxy, Garage (S3) and Mailpit (UI on `http://localhost:8025`):

   ```bash
   pnpm docker:up
   ```

4. Set up the database and the demo user:

   ```bash
   pnpm db:generate
   pnpm db:deploy
   pnpm db:seed
   pnpm --filter @huddle/web demo:setup
   ```

5. Run it:

   ```bash
   pnpm dev
   ```

   This serves the app at `https://web.huddle.localhost` through the `portless` proxy. On Windows, or for a plain port, set `NEXT_PUBLIC_BASE_URL=http://localhost:3000` and run `pnpm --filter @huddle/web exec next dev -p 3000`.

For a real deployment, `apps/web/Dockerfile` is a multi-stage build and `docker-compose.yml` runs it with Postgres on port 3000. Build with `SELF_HOSTED=true` and supply `apps/web/.env`; migrations run when the container starts. Prefer Vercel? `apps/web/vercel.json` is included; bring Postgres and SMTP or SES.

At minimum a production instance needs `DATABASE_URL`, `SECRET_PASSWORD`, `NEXT_PUBLIC_BASE_URL`, `SUPPORT_EMAIL` and an email transport.


Configuration
-------------

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string (also in `packages/database/.env`) |
| `SECRET_PASSWORD` | Yes | Session encryption secret, 32+ characters |
| `NEXT_PUBLIC_BASE_URL` | Yes | Public URL of the instance |
| `SUPPORT_EMAIL` | Yes | Shown to users and used as the reply-to address |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PWD`, `SMTP_SECURE` | For email | SMTP transport (Mailpit locally) |
| `EMAIL_PROVIDER` | No | `smtp` (default) or `ses` |
| `NEXT_PUBLIC_SELF_HOSTED` | No | `true` disables billing and paywalls |
| `DEMO_LOGIN_ENABLED`, `DEMO_EMAIL`, `DEMO_PASSWORD` | No | The **Try the demo** button |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | No | Redis for rate limiting |
| `APP_NAME`, `PRIMARY_COLOR`, `LOGO_URL` | No | White-label the instance |

Anything optional degrades cleanly: without Redis, rate limiting is off; without S3, uploads are disabled; without OAuth apps, those sign-in buttons are hidden. The full, validated list lives in `apps/web/src/env.ts`.


Contributing
------------

Issues and pull requests are welcome. Here's roughly where things live:

```
apps/
├── web/                 # the product (Next.js)
│   ├── src/app/         # routes only
│   ├── src/features/    # poll, space, scheduled-event, notifications, webhook, ...
│   ├── src/components/  # shared UI
│   ├── src/lib/         # auth, datetime, feature flags, rate limiting
│   └── tests/           # Playwright specs
├── landing/             # marketing site
└── docs/                # docs, including the self-hosting guide
packages/
├── database/            # Prisma schema, migrations, seed + demo data
├── ui/                  # Base UI + Tailwind component library
├── emails/              # React Email templates
└── billing/             # Stripe integration
```

Handy scripts while you work:

| Script | What it does |
|---|---|
| `pnpm dev:landing` / `pnpm dev:emails` / `pnpm docs:dev` | Landing site, email previews, docs |
| `pnpm db:migrate` | Create a migration |
| `pnpm db:reset` | Reset and reseed the database |
| `pnpm docker:down` | Remove the local services |

A few things help a PR land quickly:

* The web app keeps a strict layering, `app → features → components → lib`. `pnpm check:structure` will tell you if something is in the wrong place.
* Reads go through a feature's `loaders.ts`, writes through server actions in `actions.ts` that call `mutations.ts`.
* Before opening a PR, run:

      pnpm type-check
      pnpm check
      pnpm lint
      pnpm test:unit

* Flows that touch the UI have Playwright specs in `apps/web/tests` (`pnpm test:integration`).
* New strings go through i18next; `pnpm i18n:scan` extracts the keys.

Thanks for helping out.