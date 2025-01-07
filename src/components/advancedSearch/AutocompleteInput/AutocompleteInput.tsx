import React, { useEffect } from 'react';
import styles from './autocompleteInput.module.scss';
import { useState } from 'react';
import normalizeStringInput from '../../../lib/normalizeStringInput';
import TextWithMagicSymbol from '../../layout/TextWithMagicSymbol/TextWithMagicSymbol';
import Loader from '../../layout/Loader/Loader';
import { apiConfiguration } from 'services/api.service';
import { FeaturesApi, TemplatesApi } from '@spacecowmedia/spellbook-client';
import scryfall from 'scryfall-client';
import { useDebounce } from 'use-debounce';

const MAX_NUMBER_OF_MATCHING_RESULTS = 20;
const AUTOCOMPLETE_DELAY = 150;
const BLUR_CLOSE_DELAY = 900;

export type AutoCompleteOption = {
  value: string;
  label: string;
  alias?: RegExp;
  normalizedValue?: string;
  normalizedLabel?: string;
};

type Props = {
  value: string;
  inputClassName?: string;
  autocompleteOptions?: AutoCompleteOption[];
  cardAutocomplete?: boolean;
  resultAutocomplete?: boolean;
  templateAutocomplete?: boolean;
  inputId: string;
  placeholder?: string;
  label?: string;
  hasError?: boolean;
  useValueForInput?: boolean;
  onChange?: (_value: string) => void;
  maxLength?: number;
};

const AutocompleteInput: React.FC<Props> = ({
  value,
  inputClassName,
  autocompleteOptions,
  cardAutocomplete,
  resultAutocomplete,
  templateAutocomplete,
  inputId,
  label,
  useValueForInput,
  placeholder,
  hasError,
  onChange,
  maxLength,
}) => {
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const resultsRef = React.useRef<HTMLUListElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState<string>(value);
  const [debouncedLocalValue] = useDebounce(localValue, AUTOCOMPLETE_DELAY);
  const [matchingAutoCompleteOptions, setMatchingAutoCompleteOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [arrowCounter, setArrowCounter] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);

  const active =
    (autocompleteOptions && autocompleteOptions.length > 0) ||
    cardAutocomplete ||
    resultAutocomplete ||
    templateAutocomplete;
  const inMemory = !active || (!cardAutocomplete && !resultAutocomplete && !templateAutocomplete);

  const total = matchingAutoCompleteOptions.length;
  const option = matchingAutoCompleteOptions[arrowCounter];
  let screenReaderSelectionText = '';
  if (total !== 0 && value) {
    screenReaderSelectionText = option
      ? `${option.label} (${arrowCounter + 1}/${total})`
      : `${total} match${
          total > 1 ? 'es' : ''
        } found for ${value}. Use the up and down arrow keys to browse the options. Use the enter or tab key to choose a selection or continue typing to narrow down the options.`;
  }

  const lookupAutoComplete = async () => {
    if (!active) {
      return;
    }
    if (!value) {
      return handleClose();
    }
    waitForAutocomplete();
  };

  const handleClose = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
    }

    setArrowCounter(-1);
    setMatchingAutoCompleteOptions([]);
  };

  const handleChange = (value: string) => {
    setLocalValue(value);
    onChange && onChange(value);
  };

  useEffect(() => {
    lookupAutoComplete();
  }, [debouncedLocalValue]);

  const handleBlur = () => {
    if (!active) {
      return;
    }
    setTimeout(() => {
      handleClose();
    }, BLUR_CLOSE_DELAY);
  };

  const handleAutocompleteItemHover = (index: number) => {
    setArrowCounter(index);
  };

  const handleSelect = (selection: AutoCompleteOption) => {
    const value = useValueForInput ? selection.value : selection.label;
    setLocalValue(value);
    onChange && onChange(value);
    handleClose();
  };

  const scrollToSelection = () => {
    if (!resultsRef.current) {
      return;
    }
    const nodes = resultsRef.current.querySelectorAll('li');
    const li = nodes[arrowCounter];
    if (!li) {
      return;
    }
    resultsRef.current.scrollTop = li.offsetTop - 50;
  };

  const handleArrowDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (arrowCounter + 1 < total) {
      setArrowCounter(arrowCounter + 1);
    }
    scrollToSelection();
  };
  const handleArrowUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (arrowCounter >= 0) {
      setArrowCounter(arrowCounter - 1);
    }
    scrollToSelection();
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const selection = matchingAutoCompleteOptions[arrowCounter];
    if (!selection) {
      return;
    }

    e.preventDefault();

    handleSelect(selection);
  };

  const handleTab = (_e: React.KeyboardEvent<HTMLInputElement>) => {
    const selection = matchingAutoCompleteOptions[arrowCounter];
    if (!selection) {
      return;
    }

    handleSelect(selection);
  };
  const handleClick = (item: AutoCompleteOption) => {
    handleSelect(item);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const configuration = apiConfiguration();
  const templatesApi = new TemplatesApi(configuration);
  const resultsApi = new FeaturesApi(configuration);

  const findAllMatches = async (value: string, options?: AutoCompleteOption[]): Promise<AutoCompleteOption[]> => {
    const normalizedValue = normalizeStringInput(value);
    if (!options) {
      options = [];
      if (autocompleteOptions) {
        options = options.concat(autocompleteOptions);
      }
      if (!inMemory) {
        setLoading(true);
      }
      if (cardAutocomplete) {
        try {
          const cards: string[] = await scryfall.autocomplete(value, { include_extras: false });
          options = options.concat(cards.map((card) => ({ value: card, label: card })));
        } catch (e) {
          console.error(e);
        }
      }
      if (templateAutocomplete) {
        try {
          const templates = await templatesApi.templatesList({ q: value });
          options = options.concat(
            templates.results.map((template) => ({ value: template.name, label: template.name })),
          );
        } catch (e) {
          console.error(e);
        }
      }
      if (resultAutocomplete) {
        try {
          const results = await resultsApi.featuresList({ q: value });
          options = options.concat(results.results.map((result) => ({ value: result.name, label: result.name })));
        } catch (e) {
          console.error(e);
        }
      }
      if (!inMemory) {
        setLoading(false);
      }
    }
    options
      .filter((o) => o.normalizedValue === undefined)
      .forEach((o) => (o.normalizedValue = o.normalizedValue ?? normalizeStringInput(o.value)));
    options
      .filter((o) => o.normalizedLabel === undefined)
      .forEach((o) => (o.normalizedLabel = o.normalizedLabel ?? normalizeStringInput(o.label)));
    return options.filter((option) => {
      const mainMatch = option.normalizedValue?.includes(normalizedValue);

      if (mainMatch) {
        return true;
      }

      const labelMatch = option.normalizedLabel?.includes(normalizedValue);

      if (labelMatch) {
        return true;
      }

      if (option.alias) {
        return normalizedValue.match(option.alias);
      }
      return false;
    });
  };

  const findBestMatches = (totalOptions: AutoCompleteOption[], value: string) => {
    const normalizedValue = normalizeStringInput(value);
    totalOptions.sort((a, b) => {
      const indexA = a.value.indexOf(normalizedValue);
      const indexB = b.value.indexOf(normalizedValue);

      if (indexA === indexB) {
        return 0;
      }

      if (indexA === -1) {
        return 1;
      }
      if (indexB === -1) {
        return -1;
      }

      if (indexA < indexB) {
        return -1;
      } else if (indexB < indexA) {
        return 1;
      }

      return 0;
    });

    return totalOptions.slice(0, MAX_NUMBER_OF_MATCHING_RESULTS);
  };

  function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const waitForAutocomplete: () => Promise<void> = async () => {
    if (inMemory) {
      await timeout(AUTOCOMPLETE_DELAY);
    }
    if (!value) {
      return handleClose();
    }
    setMatchingAutoCompleteOptions([]);
    const totalOptions = await findAllMatches(value);
    const matchingOptions = findBestMatches(totalOptions, value);
    setMatchingAutoCompleteOptions(matchingOptions);
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      handleArrowDown(e);
    } else if (e.key === 'ArrowUp') {
      handleArrowUp(e);
    } else if (e.key === 'Enter') {
      handleEnter(e);
    } else if (e.key === 'Tab') {
      handleTab(e);
    }
  };

  useEffect(() => {
    if (firstRender) {
      return setFirstRender(false);
    }
    if (!localValue || !active) {
      return;
    }
    setMatchingAutoCompleteOptions([]);
    findAllMatches(value, autocompleteOptions).then((options) => {
      setMatchingAutoCompleteOptions(findBestMatches(options, value));
    });
  }, [localValue, active, autocompleteOptions]);

  useEffect(() => {
    setFirstRender(true);
    setLocalValue(value);
  }, [value]);

  return (
    <div className={styles.autocompleteContainer}>
      <label className="sr-only" aria-hidden htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        ref={inputRef}
        value={localValue}
        type="text"
        placeholder={placeholder}
        className={`input ${inputClassName} ${hasError ? 'error' : ''}`}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeydown}
        maxLength={maxLength}
      />
      {loading && (
        <div className="absolute right-5 top-2">
          <Loader />
        </div>
      )}
      <div role="status" aria-live="polite" className={`sr-only`}>
        {screenReaderSelectionText}
      </div>
      {total > 0 && (
        <ul ref={resultsRef} className={styles.autocompleteResults}>
          {matchingAutoCompleteOptions.map((item, index) => (
            <li
              key={index}
              className={`${inputClassName} ${styles.autocompleteResult} ${index === arrowCounter && styles.isActive}`}
              onClick={() => handleClick(item)}
              onMouseOver={() => handleAutocompleteItemHover(index)}
            >
              <TextWithMagicSymbol text={item.label} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
