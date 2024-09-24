import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SelectWithLabelOption {
  label: string;
  value: string;
}

interface SelectWithLabelProps {
  label: string;
  id: string;
  options: SelectWithLabelOption[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SelectWithLabel({ label, id, options, placeholder, value, onChange }: SelectWithLabelProps) {
  return (
    <div className="grid gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
