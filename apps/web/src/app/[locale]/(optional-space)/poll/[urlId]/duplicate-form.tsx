"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@huddle/ui/form";
import { Input } from "@huddle/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Trans } from "@/i18n/client";

const formSchema = z.object({
  title: z.string().trim().min(1),
});

export function DuplicateForm({
  name,
  onSubmit,
  defaultValues,
}: {
  name?: string;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: z.infer<typeof formSchema>;
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        id={name}
        onSubmit={form.handleSubmit((data) => {
          onSubmit?.(data);
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey="duplicateTitleLabel" defaults="Title" />
                </FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormDescription>
                  <Trans
                    i18nKey="duplicateTitleDescription"
                    defaults="Hint: Give your new poll a unique title"
                  />
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}
