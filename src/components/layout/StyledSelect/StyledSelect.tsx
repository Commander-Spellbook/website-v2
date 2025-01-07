import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from './styledSelect.module.scss';

export type Option = { value: string; label: string };

type Props = {
  selectBackgroundClassName?: string;
  selectTextClassName?: string;
  label: string;
  id: string;
  value?: string;
  options: Option[];
  onChange?: (_value: string) => void;
  disabled?: boolean;
};

const StyledSelect: React.FC<Props> = ({
  label,
  id,
  value,
  options,
  selectBackgroundClassName = 'border border-dark',
  selectTextClassName = styles.selectOption,
  onChange,
  disabled,
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLocalValue(event.target.value);
    onChange && onChange(event.target.value);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={`${selectBackgroundClassName} rounded-l-sm relative`}>
      <label htmlFor={id} className="sr-only" aria-hidden="true">
        {label}
      </label>
      <select
        disabled={disabled}
        onChange={handleChange}
        id={id}
        value={localValue}
        className={`${styles.operatorSelector} ${selectTextClassName} focus:shadow-outline`}
      >
        {options.map((option, index) => (
          <option key={`${label}-input-${index}-${option.label}`} value={option.value} className={styles.selectOption}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none" aria-hidden="true">
        <svg className={`${selectTextClassName} w-4 h-4 fill-current`} viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default StyledSelect;
