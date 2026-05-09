import React from 'react';
import {
  TextField,
  TextFieldProps,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
  Box,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { useField } from 'formik';

interface Option {
  value: string | number;
  label: string;
}

interface FormFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  type?: string;
  options?: Option[];
  multiple?: boolean;
  helperText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  type = 'text',
  label,
  options,
  multiple,
  helperText,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;
  const errorMessage = hasError ? meta.error : helperText;

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    helpers.setValue(event.target.value);
  };

  switch (type) {
    case 'select':
      return (
        <FormControl
          fullWidth
          error={hasError}
          variant="outlined"
          size={props.size}
          margin={props.margin}
        >
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            {...field}
            labelId={`${name}-label`}
            label={label}
            multiple={multiple}
            onChange={handleSelectChange}
            input={<OutlinedInput label={label} />}
            renderValue={
              multiple
                ? (selected: unknown) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          label={options?.find((opt) => opt.value === value)?.label || value}
                          size="small"
                          disabled
                        />
                      ))}
                    </Box>
                  )
                : undefined
            }
          >
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
      );

    case 'checkbox':
      return (
        <FormControl error={hasError} margin={props.margin}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                color={props.color || 'primary'}
                size={props.size}
              />
            }
            label={label}
          />
          {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
      );

    case 'switch':
      return (
        <FormControl error={hasError} margin={props.margin}>
          <FormControlLabel
            control={
              <Switch
                {...field}
                checked={field.value}
                color={props.color || 'primary'}
                size={props.size}
              />
            }
            label={label}
          />
          {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
      );

    default:
      return (
        <TextField
          {...field}
          {...props}
          type={type}
          label={label}
          error={hasError}
          helperText={errorMessage}
          fullWidth
        />
      );
  }
};

export default FormField;
