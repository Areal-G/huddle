import { Loader2Icon } from "@huddle/icons";
import clsx from "clsx";

export const Spinner = (props: { className?: string }) => {
  return (
    <Loader2Icon
      className={clsx("inline-block h-5 animate-spin", props.className)}
    />
  );
};
