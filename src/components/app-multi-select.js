import { InputLabel, OutlinedInput } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function AppMultiSelect(props) {
  const { options, onChange, value, placeholder, ...selectProps } = props;

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    onChange(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-error-label">{placeholder}</InputLabel>

      <Select
        labelId="demo-simple-select-error-label"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={placeholder} />}
        renderValue={(selected) => {
          return selected.length > 0
            ? options
                .filter((o) => selected.some((s) => s === o.value))
                .map((o) => o.label)
                .join(', ')
            : placeholder;
        }}
        {...selectProps}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.some((e) => e === option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
