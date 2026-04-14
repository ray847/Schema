import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const selectorVariants = cva(
  "w-full min-w-[200px] rounded-md border-2 p-2.5 transition-all outline-none cursor-pointer text-lg",
  {
    variants: {
      intent: {
        primary: "border-primary bg-white text-gray-900 focus:ring-4 focus:ring-primary/20",
        accent: "border-accent bg-accent-bg/5 text-accent focus:ring-4 focus:ring-accent/20",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

interface Option<T> {
  value: T;
  label: string;
}

interface SelectorProps<T extends string> extends VariantProps<typeof selectorVariants> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  title?: string;
  className?: string;
}

export function Selector<T extends string>({
  value,
  options,
  onChange,
  title = "Select View",
  intent,
  className,
}: SelectorProps<T>) {
  return (
    <section className="mb-8 text-center">
      <h2 className="mb-4 text-2xl font-medium tracking-tight text-gray-900 leading-tight">
        {title}
      </h2>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(selectorVariants({ intent }), className)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </section>
  );
}
