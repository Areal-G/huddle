"use client";
import { buttonVariants } from "@huddle/ui";
import { Button } from "@huddle/ui/button";
import { CardFooter } from "@huddle/ui/card";
import { Form } from "@huddle/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { usePoll } from "@/features/poll/client";
import { PollSettingsForm } from "@/features/poll/components/forms/poll-settings";
import { useUpdatePollMutation } from "@/features/poll/components/mutations";
import { Trans } from "@/i18n/client";

const Page = () => {
  const poll = usePoll();

  const router = useRouter();

  const pollLink = `/poll/${poll.id}`;

  const redirectBackToPoll = () => {
    router.push(pollLink);
  };

  const update = useUpdatePollMutation();

  const form = useForm({
    defaultValues: {
      hideParticipants: poll.hideParticipants,
      hideScores: poll.hideScores,
      enableComments: !poll.disableComments,
      requireParticipantEmail: poll.requireParticipantEmail,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async ({ enableComments, ...data }) => {
          const res = await update.mutateAsync({
            pollId: poll.id,
            ...data,
            disableComments: !enableComments,
          });
          if (res.ok) {
            redirectBackToPoll();
          }
        })}
      >
        <PollSettingsForm>
          <CardFooter className="justify-between">
            <Link href={pollLink} className={buttonVariants()}>
              <Trans i18nKey="cancel" />
            </Link>
            <Button type="submit" variant="primary">
              <Trans i18nKey="save" />
            </Button>
          </CardFooter>
        </PollSettingsForm>
      </form>
    </Form>
  );
};

export default Page;
