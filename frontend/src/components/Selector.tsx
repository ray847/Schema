import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';

interface Option<T> {
  value: T;
  label: string;
}

interface SelectorProps<T extends string> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  title?: string;
  className?: string;
  intent?: 'primary' | 'accent';
}

export function Selector<T extends string>({
  value,
  options,
  onChange,
  title = 'Select View',
  className,
  intent = 'primary',
}: SelectorProps<T>) {
  const labelId = `${title.toLowerCase().replace(/\s+/g, '-')}-label`;

  return (
    <Box className={className} sx={{ mb: 4, textAlign: 'center' }}>
      <Typography component="h2" sx={{ mb: 2 }} variant="h5">
        {title}
      </Typography>
      <FormControl color={intent === 'accent' ? 'secondary' : 'primary'} sx={{ minWidth: 240 }}>
        <InputLabel id={labelId}>{title}</InputLabel>
        <Select
          label={title}
          labelId={labelId}
          onChange={(event: SelectChangeEvent) => onChange(event.target.value as T)}
          value={value}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
