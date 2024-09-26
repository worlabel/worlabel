import { Label } from '@/components/ui/label';
import { Input } from '../ui/input';
interface InputWithLabelProps {
  label: string;
  id: string;
  placeholder: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function InputWithLabel({ label, id, placeholder, value, disabled, onChange }: InputWithLabelProps) {
  return (
    <div className="grid gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
