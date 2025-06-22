import languages from "@huddle/languages";
import { Icon } from "@huddle/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@huddle/ui/select";
import { LanguagesIcon } from "lucide-react";

export const LanguageSelect: React.FunctionComponent<{
  className?: string;
  value?: string;
  onChange?: (language: string) => void;
}> = ({ className, value, onChange }) => {
  return (
    <Select
      items={languages}
      value={value}
      onValueChange={(language) => {
        if (language) {
          onChange?.(language);
        }
      }}
    >
      <SelectTrigger className={className}>
        <Icon>
          <LanguagesIcon />
        </Icon>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
