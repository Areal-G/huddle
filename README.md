Huddle
======

Group scheduling without the email thread.

About
-----

Huddle is a small tool for the "what time works for everyone?" problem. An organizer proposes a few dates or time slots and shares one link. Invitees open it, mark each option *yes*, *if need be* or *no*, and don't need an account to do it. When the votes are in, the organizer picks the winner.

What works so far:

* polls with dates and time slots
* a public voting link, no sign-up for invitees
* yes / if need be / no on every option
* times shown in each invitee's own time zone
* finalizing the winning option

Usage
-----

You'll need Node.js 24, pnpm and Docker (Postgres and a local mail catcher run in containers).

Install and copy the sample env files:

    pnpm install
    cp apps/web/.env.sample apps/web/.env
    cp packages/database/.env.sample packages/database/.env

Set `SECRET_PASSWORD` in `apps/web/.env` (`openssl rand -hex 32` works). Then start the services, set up the database and run it:

    pnpm docker:up
    pnpm db:generate
    pnpm db:deploy
    pnpm db:seed
    pnpm dev

Emails land in Mailpit at http://localhost:8025.

Feedback and issues are welcome.