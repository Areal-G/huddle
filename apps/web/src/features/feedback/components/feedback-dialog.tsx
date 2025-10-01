"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@huddle/ui/button";
import type { DialogProps } from "@huddle/ui/dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@huddle/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@huddle/ui/form";
import { Textarea } from "@huddle/ui/textarea";
import { mutationOptions } from "@next-safe-action/adapter-tanstack-query";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2Icon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Trans, useTranslation } from "@/i18n/client";
import { submitFeedbackAction } from "../actions";
import { isFeedbackEnabled } from "../constants";
import { feedbackSchema } from "../schema";

export function FeedbackDialog(props: DialogProps) {
  const { t } = useTranslation();
  const submitFeedback = useMutation(mutationOptions(submitFeedbackAction));
  const form = useForm({
    resolver: zodResolver(feedbackSchema),
  });

  if (!isFeedbackEnabled) {
    return null;
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        {!submitFeedback.isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>
                <Trans i18nKey="feedback" defaults="Feedback" />
              </DialogTitle>
              <DialogDescription>
                <Trans
                  i18nKey="sendFeedbackDesc"
                  defaults="Share your feedback with us."
                />
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                className="grid gap-4"
                onSubmit={form.handleSubmit((data) => {
                  submitFeedback.mutate(data);
                })}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        disabled={submitFeedback.isPending}
                        className="w-full"
                        rows={5}
                        {...field}
                        placeholder={t("feedbackDialogEnterFeedback", {
                          defaultValue: "Enter your feedback",
                        })}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose render={<Button />}>
                    <Trans i18nKey="cancel" defaults="Cancel" />
                  </DialogClose>
                  <Button
                    type="submit"
                    loading={submitFeedback.isPending}
                    variant="primary"
                  >
                    <Trans i18nKey="sendFeedback" defaults="Send feedback" />
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <div className="flex h-60 items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <CheckCircle2Icon className="h-12 w-12 text-green-500" />
              <div className="mt-4 text-sm">
                <Trans
                  i18nKey="sendFeedbackSuccess"
                  defaults="Thank you for your feedback!"
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
