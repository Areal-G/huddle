Huddle
======

Group scheduling without the email thread. Propose a few times, share one link, and let everyone vote with no account needed.

About
-----

Huddle replaces the "what time works for everyone?" email thread. An organizer proposes dates or time slots, invitees vote from a public link, and the organizer finalizes the winner and sends calendar invites. Teams get shared spaces with members and roles. It is a Next.js monorepo (web app, landing site, docs, email templates) and can run as a hosted service with Stripe billing or be self-hosted.

Self-hosting: you can self-host Huddle with Docker. There is a `Dockerfile` in `apps/web` and a `docker-compose.yml` that runs it with Postgres. Build with `SELF_HOSTED=true` and give it an `apps/web/.env`.

Features
--------

| Feature | Description |
|---|---|
| Polls | Create a poll with dates or time slots |
| Month grid | Pick dates on a month grid |
| Week view | Pick time slots on a week view |
| Default duration | Set a default duration for slots |
| Per-day slots | Add different time slots per day |
| Require email | Invitees must give an email to vote |
| Hide names | Hide participant names from each other |
| Hide votes | Hide votes until the invitee has voted |
| Comments | Comments on polls |
| Vote options | Choose which vote options are allowed |
| Public link | Share one link with invitees |
| No account | Invitees vote without signing up |
| Name picker | Pick your name or type a new one |
| Three answers | Yes / if need be / no |
| Time zones | Times shown in the invitee's time zone |
| Mobile grid | Grid becomes a stacked list on phones |
| Leader | Most popular option is highlighted |
| Responses | Per-participant availability view |
| Finalize | Turn the winning option into an event |
| Invites | `.ics` calendar invites by email |
| Events | Upcoming, past and cancelled, grouped by day |
| Home | Dashboard of open polls |
| Weekly responses | Responses this week vs last |
| Response rate | Invite response rate |
| Activity | Recent-activity feed |
| Spaces | Shared team workspaces |
| Roles | Admin and member roles |
| Seats | Seat limits per space |
| Permissions | CASL on server and client |
| Email OTP | Sign in with a one-time code |
| Google | Google sign-in |
| Microsoft | Microsoft sign-in |
| OIDC | Any OIDC provider |
| Guests | Guest sessions |
| Calendars | Calendar connections |
| Video | Google Meet, Zoom, Teams, Webex links |
| Webhooks | Outgoing webhooks |
| REST API | API with API keys |
| Email | React Email over SMTP or Amazon SES |
| Queue | Emails sent through a queue |
| i18n | 16 locales |
| White-label | Custom name, colours and logo |
| Maintenance | Maintenance mode |

FAQ
---

**Is Huddle free?**
Yes, you can run it yourself.

**Do invitees need an account?**
No. They open the link and vote.

**Can I use it on my phone?**
Yes. The voting grid turns into a stacked list on small screens.

**Does it support time zones?**
Yes. Every invitee sees times in their own time zone.

**Can I see who voted for what?**
Yes, the responses view shows every participant's availability.

**Does it send calendar invites?**
Yes, when you finalize a poll everyone gets an `.ics` invite by email.

**Is there a dark mode?**
Yes.

**What languages are supported?**
16 locales.

**Can I self-host it?**
Yes! Build the Docker image from `apps/web/Dockerfile` with `SELF_HOSTED=true`, run `docker-compose.yml` (it brings Postgres) and supply `apps/web/.env`. Migrations run on container start. Setting `NEXT_PUBLIC_SELF_HOSTED=true` removes billing and unlocks every paid feature.

**Do I need Redis?**
No. Without Redis, rate limiting is just turned off.

**Do I need S3?**
No. Without S3, uploads are disabled.

**How do I try it?**
See Usage below.

Usage
-----

You need Node.js 24, pnpm 12 and Docker.

    git clone <your-fork-url> huddle
    cd huddle
    pnpm install
    cp apps/web/.env.sample apps/web/.env
    cp packages/database/.env.sample packages/database/.env

Set `SECRET_PASSWORD` (`openssl rand -hex 32`).

    pnpm docker:up
    pnpm db:generate
    pnpm db:deploy
    pnpm db:seed
    pnpm --filter @huddle/web demo:setup
    pnpm dev

Open `/login` and click **Try the demo** (needs `DEMO_LOGIN_ENABLED=true`). Mail goes to Mailpit at http://localhost:8025.

On Windows set `NEXT_PUBLIC_BASE_URL=http://localhost:3000` and run:

    pnpm --filter @huddle/web exec next dev -p 3000

Tests: `pnpm test:unit` (Vitest) and `pnpm test:integration` (Playwright).