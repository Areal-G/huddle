"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@huddle/ui/button";
import type { DialogProps } from "@huddle/ui/dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@huddle/ui/dialog";
import { Form } from "@huddle/ui/form";
import { toast } from "@huddle/ui/sonner";
import React from "react";
import { useForm } from "react-hook-form";
import {
  buildEventTypeFormSchema,
  EventTypeFormFields,
  eventTypeToFormValues,
  eventTypeValuesToInput,
} from "@/features/event-types/components/event-type-form";
import type { EventTypeDTO } from "@/features/event-types/types";
import { Trans, useTranslation } from "@/i18n/client";
import { trpc } from "@/trpc/client";

export function EditEventTypeDialog({
  eventType,
  open,
  onOpenChange,
}: DialogProps & {
  eventType: EventTypeDTO;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="editEventTypeTitle" defaults="Edit event type" />
          </DialogTitle>
        </DialogHeader>
        {/* Mounted per open, so each edit starts from the event type it was
        opened for and a cancelled edit leaves nothing behind */}
        <EditEventTypeForm
          eventType={eventType}
          onSaved={() => onOpenChange?.(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditEventTypeForm({
  eventType,
  onSaved,
}: {
  eventType: EventTypeDTO;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const updateEventType = trpc.eventTypes.update.useMutation();

  const [showMaxAttendees, setShowMaxAttendees] = React.useState(
    eventType.capacity !== null,
  );
  const [showDescription, setShowDescription] = React.useState(
    eventType.description !== null,
  );

  const formSchema = React.useMemo(() => buildEventTypeFormSchema(t), [t]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: eventTypeToFormValues(eventType),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const input = eventTypeValuesToInput(values);

    try {
      await updateEventType.mutateAsync({ id: eventType.id, ...input });
    } catch {
      toast.error(
        t("updateEventTypeError", {
          defaultValue: "Failed to update event type",
        }),
      );
      return;
    }
    onSaved();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        <EventTypeFormFields
          form={form}
          showMaxAttendees={showMaxAttendees}
          setShowMaxAttendees={setShowMaxAttendees}
          showDescription={showDescription}
          setShowDescription={setShowDescription}
        />
        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" disabled={updateEventType.isPending} />
            }
          >
            <Trans i18nKey="cancel" defaults="Cancel" />
          </DialogClose>
          <Button
            type="submit"
            variant="primary"
            loading={updateEventType.isPending}
          >
            <Trans i18nKey="save" defaults="Save" />
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
