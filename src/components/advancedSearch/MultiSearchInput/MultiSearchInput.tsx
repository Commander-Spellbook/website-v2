import pluralize from 'pluralize';
import React, { useState } from 'react';
import styles from './multiSearchInput.module.scss';
import StyledSelect, { Option } from '../../layout/StyledSelect/StyledSelect';
import AutocompleteInput, { AutoCompleteOption } from '../AutocompleteInput/AutocompleteInput';
import Icon, { SpellbookIcon } from '../../layout/Icon/Icon';

type MultiSearchInputValue = {
  value: string;
  operator: string;
  numeric?: boolean;
  negate?: boolean;
  error?: string;
}[];

type Props = {
  value: MultiSearchInputValue;
  autocompleteOptions?: Array<AutoCompleteOption>;
  cardAutocomplete?: boolean;
  resultAutocomplete?: boolean;
  selectOptions?: Array<Option>;
  useValueForAutocompleteInput?: boolean;
  label: string;
  labelIcon?: SpellbookIcon;
  pluralLabel?: string;
  defaultPlaceholder?: string;
  operatorOptions: Array<{
    operator: string;
    label: string;
    numeric?: boolean;
    negate?: boolean;
    placeholder?: string;
  }>;
  onChange?: (_value: MultiSearchInputValue) => void;
};

const MultiSearchInput: React.FC<Props> = ({
  value,
  autocompleteOptions,
  cardAutocomplete,
  resultAutocomplete,
  useValueForAutocompleteInput,
  label,
  labelIcon,
  pluralLabel,
  defaultPlaceholder,
  operatorOptions,
  onChange,
  selectOptions,
}: Props) => {
  const [inputs, setInputs] = useState<MultiSearchInputValue>(value);

  const inputLabel = pluralLabel || pluralize(label, value.length);

  const addInput = (index: number) =>
    setInputs([...inputs.slice(0, index + 1), { ...operatorOptions[0], value: '' }, ...inputs.slice(index + 1)]);

  const removeInput = (index: number) => {
    const newInputs = [...inputs.slice(0, index), ...inputs.slice(index + 1)];
    setInputs(newInputs);
    onChange && onChange(newInputs);
  };

  const getInputId = (index: number) => `${label.toLowerCase().replace(/\s/g, '-')}-input-${index}`;

  const getSelectId = (index: number) => `${label.toLowerCase().replace(/\s/g, '-')}-select-${index}`;

  const getPlaceHolder = (input: {
    value: string;
    operator: string;
    numeric?: boolean;
    negate?: boolean;
    error?: string;
  }) => {
    const option = operatorOptions.find(
      (option) =>
        option.operator === input.operator && option.numeric === input.numeric && option.negate === input.negate,
    );
    if (option && option.numeric == true && !option.placeholder) {
      return `ex: 2`;
    }
    if (!option || !option.placeholder) {
      return defaultPlaceholder || '';
    }
    return option.placeholder;
  };

  const handleSelectChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    const [operator, numeric, negated] = value.split('|');
    newInputs[index].operator = operator;
    newInputs[index].numeric = numeric === '' ? undefined : numeric === 'true';
    newInputs[index].negate = negated === '' ? undefined : negated === 'true';
    setInputs(newInputs);
    onChange && onChange(newInputs);
  };
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index].value = value;
    setInputs(newInputs);
    onChange && onChange(newInputs);
  };

  return (
    <div>
      <label className={styles.inputLabel}>
        {labelIcon && <Icon name={labelIcon} />} {inputLabel}
      </label>
      {inputs.map((input, index) => (
        <div key={`${label}-input-${index}`} className={`my-2 input-wrapper-${index}`}>
          <div className="sm:flex">
            <StyledSelect
              label={`Modifier for ${label}`}
              disabled={operatorOptions.length === 1}
              onChange={(value) => handleSelectChange(index, value)}
              id={getSelectId(index)}
              options={operatorOptions.map((option) => ({
                value: option.operator + '|' + (option.numeric ?? '') + '|' + (option.negate ?? ''),
                label: option.label,
              }))}
              selectTextClassName="sm:w-1/2 flex-grow bg-transparent"
              selectBackgroundClassName={`${
                input.error ? 'border-danger' : 'border-dark'
              } border border-b-0 sm:border-b sm:border-r-0 sm:w-1/2 flex-grow`}
            />
            <div className="w-full flex-grow flex flex-col sm:flex-row">
              {!selectOptions && (
                <AutocompleteInput
                  value={input.value}
                  onChange={(value) => handleInputChange(index, value)}
                  label={inputLabel}
                  inputClassName={styles.autocompleteInput}
                  autocompleteOptions={autocompleteOptions}
                  cardAutocomplete={cardAutocomplete}
                  resultAutocomplete={resultAutocomplete}
                  inputId={getInputId(index)}
                  placeholder={getPlaceHolder(input)}
                  hasError={!!input.error}
                  useValueForInput={useValueForAutocompleteInput}
                />
              )}
              {selectOptions && (
                <StyledSelect
                  label={inputLabel}
                  id={getInputId(index) + '-value'}
                  options={selectOptions}
                  onChange={(value) => handleInputChange(index, value)}
                  selectBackgroundClassName="flex-grow border-dark border"
                />
              )}
              <div className="flex">
                {inputs.length > 1 && (
                  <button
                    type="button"
                    className={`minus-button ${styles.inputButton} ${
                      input.error ? 'bg-danger border-danger' : 'bg-dark border-dark'
                    } minus-button-${index}`}
                    onClick={() => removeInput(index)}
                  >
                    –
                    <span className="sr-only">
                      Remove {input.value} search query for {label}
                    </span>
                    <span aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  className={`plus-button ${styles.inputButton} ${
                    input.error ? 'bg-danger border-danger' : 'bg-dark border-dark'
                  } plus-button-${index}`}
                  onClick={() => addInput(index)}
                >
                  +
                  <span className="sr-only">
                    Remove {input.value} search query for {label}
                  </span>
                  <span aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          {input.error && (
            <div className={`input-error text-danger w-full py-2 px-4 text-center rounded-b-sm`}>{input.error}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MultiSearchInput;
