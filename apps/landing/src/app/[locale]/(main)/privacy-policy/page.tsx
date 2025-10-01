"use cache";

import { absoluteUrl } from "@huddle/utils/absolute-url";
import { cacheLife } from "next/cache";
import { LegalPageLayout } from "@/components/legal-page-layout";
import { Section } from "@/components/section";

export default async function PrivacyPolicy() {
  cacheLife("max");
  return (
    <Section>
      <LegalPageLayout title="Privacy policy" lastUpdated="2026-11-09">
        <p>
          This privacy policy explains what personal data Huddle collects, why
          it is collected and the rights you have over it. Replace this text
          with the policy that applies to your own deployment.
        </p>

        <h2>Information we collect</h2>
        <p>
          When you create a poll, respond to one or create an account, we store
          the details you enter: your name, your email address, your votes and
          any comments you leave. If you connect a calendar or a video
          conferencing account, we store the access tokens needed to read your
          availability and create meetings on your behalf.
        </p>

        <h2>How we use your data</h2>
        <p>
          Your data is used only to run the service: to show polls to the people
          you share them with, to send the emails you ask for (such as
          invitations, reminders and booking confirmations) and to keep your
          account secure. We do not sell your data and we do not use it for
          advertising.
        </p>

        <h2>Analytics</h2>
        <p>
          Huddle does not include third-party analytics or tracking scripts.
          Server logs may record technical details such as your IP address for a
          short period to keep the service secure and reliable.
        </p>

        <h2>Retention of personal data</h2>
        <p>
          We keep your data for as long as your account or polls exist. When you
          delete a poll or your account, the related personal data is removed
          from our database.
        </p>

        <h2>Your rights</h2>
        <p>
          You can view, correct, export or delete your personal data at any time
          from your account settings, or by contacting us.
        </p>

        <h2>Contact</h2>
        <p>
          If you have any questions about this policy, please contact us at{" "}
          <a href="mailto:support@huddle.example">support@huddle.example</a>.
        </p>
      </LegalPageLayout>
    </Section>
  );
}

export async function generateMetadata() {
  cacheLife("max");
  return {
    // English only, so every locale prefix points at the English URL
    alternates: { canonical: absoluteUrl("/privacy-policy") },
    title: "Privacy Policy",
    description: "The privacy policy for Huddle.",
  };
}
