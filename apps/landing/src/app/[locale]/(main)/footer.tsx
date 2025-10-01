import Image from "next/image";
import { Trans } from "react-i18next/TransWithoutContext";

import { FooterPattern } from "@/components/home/footer-pattern";
import { LinkBase } from "@/i18n/client/link";
import { getTranslation } from "@/i18n/server";
import { LanguageSelect } from "./language-select";

export const Footer = async ({ locale }: { locale: string }) => {
  const { t } = await getTranslation(locale, "common");
  return (
    <div className="mx-auto space-y-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="space-y-6">
          <div className="relative size-8">
            <Image
              src="/logo-footer.svg"
              fill
              alt="Huddle"
              className="object-contain"
            />
          </div>
          <p className="max-w-sm text-pretty text-gray-600 text-sm leading-relaxed">
            <Trans
              t={t}
              ns="common"
              i18nKey="footerTagline"
              defaults="Huddle is an open-source meeting scheduling tool that helps you find the best time to meet, without the back and forth."
            />
          </p>
        </div>
        {/* Decorative, and there is no room for it beside the tagline until
            the footer goes side by side, so it only shows from `lg` up. */}
        <FooterPattern className="hidden w-full lg:block lg:min-w-0 lg:flex-1 lg:self-stretch" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-8">
        <div className="space-y-8">
          <div>
            <div className="mb-6 font-medium text-gray-800 text-sm uppercase tracking-wide">
              <Trans t={t} ns="common" i18nKey="product" defaults="Product" />
            </div>
            <ul className="grid gap-3 text-sm">
              <li>
                <LinkBase
                  className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                  href="/pricing"
                >
                  <Trans t={t} i18nKey="pricing" defaults="Pricing" />
                </LinkBase>
              </li>
              <li>
                <LinkBase
                  className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                  href="/free-scheduling-poll"
                >
                  <Trans
                    t={t}
                    ns="common"
                    i18nKey="schedulingPoll"
                    defaults="Scheduling poll"
                  />
                </LinkBase>
              </li>
              <li>
                <LinkBase
                  className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                  href="/security"
                >
                  <Trans
                    t={t}
                    ns="common"
                    i18nKey="security"
                    defaults="Security"
                  />
                </LinkBase>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-6 font-medium text-gray-800 text-sm uppercase tracking-wide">
              <Trans t={t} ns="common" i18nKey="compare" defaults="Compare" />
            </div>
            <ul className="grid gap-3 text-sm">
              <li>
                <LinkBase
                  className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                  href="/best-doodle-alternative"
                >
                  <Trans
                    t={t}
                    ns="common"
                    i18nKey="doodleAlternative"
                    defaults="Doodle alternative"
                  />
                </LinkBase>
              </li>
              <li>
                <LinkBase
                  className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                  href="/when2meet-alternative"
                >
                  <Trans
                    t={t}
                    ns="common"
                    i18nKey="when2MeetAlternative"
                    defaults="When2meet alternative"
                  />
                </LinkBase>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="mb-6 font-medium text-gray-800 text-sm uppercase tracking-wide">
            <Trans t={t} ns="common" i18nKey="useCases" defaults="Use cases" />
          </div>
          <ul className="grid gap-3 text-sm">
            <li>
              <LinkBase
                className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                href="/scheduling-for/assistants"
              >
                <Trans
                  t={t}
                  ns="common"
                  i18nKey="assistants"
                  defaults="Assistants"
                />
              </LinkBase>
            </li>
            <li>
              <LinkBase
                className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                href="/scheduling-for/committees"
              >
                <Trans
                  t={t}
                  ns="common"
                  i18nKey="committees"
                  defaults="Committees and boards"
                />
              </LinkBase>
            </li>
            <li>
              <LinkBase
                className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                href="/scheduling-for/sports-clubs"
              >
                <Trans
                  t={t}
                  ns="common"
                  i18nKey="sportsClubs"
                  defaults="Sports clubs"
                />
              </LinkBase>
            </li>
            <li>
              <LinkBase
                className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                href="/scheduling-for/thesis-defense"
              >
                <Trans
                  t={t}
                  ns="common"
                  i18nKey="thesisDefense"
                  defaults="Thesis defenses"
                />
              </LinkBase>
            </li>
            <li>
              <LinkBase
                className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                href="/scheduling-for/legal"
              >
                <Trans
                  t={t}
                  ns="common"
                  i18nKey="legal"
                  defaults="Law firms and mediators"
                />
              </LinkBase>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-6 font-medium text-gray-800 text-sm uppercase tracking-wide">
            <Trans t={t} ns="common" i18nKey="footerLegal" defaults="Legal" />
          </div>
          <ul className="grid gap-3 text-sm">
            <li>
              <LinkBase
                className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                href="/privacy-policy"
              >
                <Trans
                  t={t}
                  ns="common"
                  i18nKey="privacyPolicy"
                  defaults="Privacy policy"
                />
              </LinkBase>
            </li>
            <li>
              <LinkBase
                className="inline-block font-normal text-gray-600 hover:text-gray-800 hover:no-underline"
                href="/terms-of-use"
              >
                <Trans
                  t={t}
                  ns="common"
                  i18nKey="termsOfUse"
                  defaults="Terms of use"
                />
              </LinkBase>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-x-8 gap-y-8 sm:pb-8 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <p className="whitespace-nowrap text-gray-600 text-sm leading-loose">
          &copy; 2026 Your Company
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-48">
            <LanguageSelect />
          </div>
        </div>
      </div>
    </div>
  );
};
