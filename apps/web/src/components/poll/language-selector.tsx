import languages from "@huddle/languages";
import { Button } from "@huddle/ui/button";
import { Icon } from "@huddle/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@huddle/ui/select";
import { GlobeIcon } from "lucide-react";

export const LanguageSelect: React.FunctionComponent<{
  className?: string;
  value?: string;
  onChange?: (language: string) => void;
}> = ({ className, value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger asChild className={className}>
        <Button variant="ghost">
          <Icon>
            <GlobeIcon />
          </Icon>
          <SelectValue />
        </Button>
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
