import { buttonVariants } from "@huddle/ui";
import { HomeIcon, PlusIcon } from "lucide-react";
import { ErrorPage, ErrorPageLinkItem } from "@/components/error-page";
import { InstanceFooterLinks } from "@/components/instance-footer-links";
import { Link } from "@/components/link";
import { DefaultLogo } from "@/features/branding/components/default-logo";
import { loadFooterLinks } from "@/features/instance-settings/loaders";
import { getTranslation } from "@/i18n/server";

export default async function NotFoundPage() {
  // TODO [2023-11-03]: not-found doesn't have access to params right now
  // See: https://github.com/vercel/next.js/discussions/43179
  const [{ t }, footerLinks] = await Promise.all([
    getTranslation("en"),
    loadFooterLinks(),
  ]);

  return (
    <ErrorPage
      logo={<DefaultLogo />}
      label={t("notFoundLabel", { defaultValue: "404" })}
      title={t("notFoundTitle", { defaultValue: "Page not found" })}
      description={t("notFoundDescription", {
        defaultValue:
          "Sorry, we couldn't find the page you're looking for. Here are some helpful links instead.",
      })}
      actions={
        <Link
          href="/"
          className={buttonVariants({ size: "lg", variant: "primary" })}
        >
          {t("errorBackToHome", { defaultValue: "Back to home" })}
        </Link>
      }
      footer={
        footerLinks.length > 0 ? (
          <InstanceFooterLinks links={footerLinks} />
        ) : null
      }
    >
      <ErrorPageLinkItem
        href="/"
        icon={<HomeIcon className="size-4 text-muted-foreground" />}
        title={t("errorLinkHome", { defaultValue: "Home" })}
        description={t("errorLinkHomeDescription", {
          defaultValue: "Go back to your dashboard.",
        })}
      />
      <ErrorPageLinkItem
        href="/new"
        icon={<PlusIcon className="size-4 text-muted-foreground" />}
        title={t("errorLinkCreatePoll", { defaultValue: "Create a poll" })}
        description={t("errorLinkCreatePollDescription", {
          defaultValue: "Start scheduling a new meeting.",
        })}
      />
    </ErrorPage>
  );
}
