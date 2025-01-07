import ArtCircle from '../components/layout/ArtCircle/ArtCircle';
import Link from 'next/link';
import MultiSearchInput from '../components/advancedSearch/MultiSearchInput/MultiSearchInput';
import { DEFAULT_VENDOR } from '../lib/constants';
import React, { useEffect, useState } from 'react';
import COLOR_AUTOCOMPLETES from '../lib/colorAutocompletes';
import styles from './advanced-search.module.scss';
import RadioSearchInput from '../components/advancedSearch/RadioSearchInput/RadioSearchInput';
import { useRouter } from 'next/router';
import SpellbookHead from '../components/SpellbookHead/SpellbookHead';
import { SpellbookIcon } from '../components/layout/Icon/Icon';
import { LEGALITY_FORMATS } from 'lib/types';

type OperatorOption = {
  operator: string;
  label: string;
  numeric?: boolean;
  negate?: boolean;
  placeholder?: string;
};

type TagOption = {
  name: string;
  label: string;
  labelIcon?: SpellbookIcon;
};

const CARD_OPERATOR_OPTIONS: OperatorOption[] = [
  {
    operator: ':',
    label: 'Has card with name',
    placeholder: 'ex: isochron',
  },
  {
    operator: '=',
    label: 'Has card with exact name',
    placeholder: 'ex: basalt monolith',
  },
  {
    operator: ':',
    negate: true,
    label: 'Does not have card with name',
    placeholder: 'ex: isochron',
  },
  {
    operator: '=',
    negate: true,
    label: 'Does not have card with exact name',
    placeholder: 'ex: basalt monolith',
  },
];

const CARD_AMOUNT_OPERATOR_OPTIONS: OperatorOption[] = [
  { operator: '=', label: 'Contains exactly x cards (number)', numeric: true },
  { operator: '>=', label: 'Contains at least x cards (number)', numeric: true },
  { operator: '<', label: 'Contains less than x cards (number)', numeric: true },
];

const CARD_TYPE_OPERATOR_OPTIONS: OperatorOption[] = [
  {
    operator: ':',
    label: 'Contains the phrase',
    placeholder: 'ex: sorcery, instant, artifact',
  },
  {
    operator: '=',
    label: 'Is exactly',
    placeholder: 'ex: sorcery, instant, artifact',
  },
  {
    operator: ':',
    negate: true,
    label: 'Does not contain the phrase',
    placeholder: 'ex: sorcery, instant, artifact',
  },
  {
    operator: '=',
    negate: true,
    label: 'Is not exactly',
    placeholder: 'ex: sorcery, instant, artifact',
  },
];

const CARD_ORACLE_TEXT_OPERATOR_OPTIONS: OperatorOption[] = [
  {
    operator: ':',
    label: 'Contains the phrase',
    placeholder: 'ex: mana, untap, additional',
  },
  { operator: '=', label: 'Is exactly' },
  {
    operator: ':',
    negate: true,
    label: 'Does not contain the phrase',
    placeholder: 'ex: mana, untap, additional',
  },
  { operator: '=', label: 'Is not exactly', negate: true },
];

const CARD_KEYWORD_OPERATOR_OPTIONS: OperatorOption[] = [
  {
    operator: ':',
    label: 'Has the keyword',
    placeholder: 'ex: cycling, delve, partner',
  },
  {
    operator: ':',
    negate: true,
    label: 'Does not have the keyword',
    placeholder: 'ex: cycling, delve, partner',
  },
];

const CARD_MANA_VALUE_OPERATOR_OPTIONS: OperatorOption[] = [
  {
    operator: '=',
    label: 'Has a mana value of x (number)',
    numeric: true,
  },
  {
    operator: '>=',
    label: 'Has a mana value of at least x (number)',
    numeric: true,
  },
  {
    operator: '<',
    label: 'Has a mana value of less than x (number)',
    numeric: true,
  },
];

const COLOR_IDENTITY_OPERATOR_OPTIONS: OperatorOption[] = [
  {
    operator: ':',
    label: 'Is within the color identity',
  },
  {
    operator: '=',
    label: 'Is exactly the color identity',
  },
  {
    operator: ':',
    negate: true,
    label: 'Is not within the color identity',
  },
  {
    operator: '=',
    negate: true,
    label: 'Is not exactly the color identity',
  },
  { operator: '>=', label: 'Contains at least x colors (number)', numeric: true },
  { operator: '<', label: 'Contains less than x colors (number)', numeric: true },
  { operator: '=', label: 'Contains exactly x colors (number)', numeric: true },
];

const COMBO_DATA_OPERATOR_OPTIONS: OperatorOption[] = [
  {
    operator: ':',
    label: 'Contains the phrase',
    placeholder: 'ex: mana, untap, additional',
  },
  { operator: '=', label: 'Is exactly' },
  { operator: '>=', label: 'Contains at least x (number)', numeric: true },
  { operator: '<', label: 'Contains less than x (number)', numeric: true },
  {
    operator: ':',
    negate: true,
    label: 'Does not contain the phrase',
    placeholder: 'ex: mana, untap, additional',
  },
  { operator: '=', label: 'Is not exactly', negate: true },
];

const RESULTS_OPERATOR_OPTIONS: OperatorOption[] = [
  {
    operator: ':',
    label: 'Contains the phrase',
    placeholder: 'ex: mana, untap, additional',
  },
  {
    operator: '=',
    label: 'Is exactly',
    placeholder: 'ex: Infinite Colorless Mana',
  },
  {
    operator: ':',
    negate: true,
    label: 'Does not contain the phrase',
    placeholder: 'ex: mana, untap, additional',
  },
  {
    operator: '=',
    negate: true,
    label: 'Is not exactly',
    placeholder: 'ex: Infinite Colorless Mana',
  },
  { operator: '>=', label: 'Contains at least x (number)', numeric: true },
  { operator: '<', label: 'Contains less than x (number)', numeric: true },
  { operator: '=', label: 'Contains exactly x (number)', numeric: true },
];

const TAGS_OPTIONS: TagOption[] = [
  {
    name: 'spoiler',
    label: 'Contains a spoiler/previewed card',
    labelIcon: 'eye',
  },
  {
    name: 'commander',
    label: 'Does the combo require a commander?',
    labelIcon: 'commandZone',
  },
  {
    name: 'featured',
    label: 'Is the combo featured in the home page?',
    labelIcon: 'star',
  },
];

const COMMANDER_OPTIONS: OperatorOption[] = [
  {
    operator: ':',
    label: 'Requires a commander whose name contains the phrase',
    placeholder: 'ex: Krark',
  },
  {
    operator: '=',
    label: 'Requires a commander whose name is exactly',
    placeholder: 'ex: Krark, the Thumbless',
  },
  {
    operator: ':',
    negate: true,
    label: 'Does not require a commander whose name contains the phrase',
    placeholder: 'ex: Krark',
  },
  {
    operator: '=',
    negate: true,
    label: 'Does not require a commander whose name is exactly',
    placeholder: 'ex: Krark, the Thumbless',
  },
];

const POPULARITY_OPTIONS: OperatorOption[] = [
  { operator: '>=', label: 'In at least x decks (number)', numeric: true },
  { operator: '<', label: 'In less than x decks (number)', numeric: true },
  { operator: '=', label: 'In exactly x decks (number)', numeric: true },
];

const PRICE_OPTIONS: OperatorOption[] = [
  {
    operator: '<=',
    label: 'Costs at most x',
    placeholder: 'ex: 5',
    numeric: true,
  },
  {
    operator: '>=',
    label: 'Costs at least x',
    placeholder: 'ex: 5',
    numeric: true,
  },
  {
    operator: '=',
    label: 'Costs exactly x',
    placeholder: 'ex: 5',
    numeric: true,
  },
];

const PRICE_VENDORS = [
  {
    value: 'cardkingdom',
    label: 'Card Kingdom',
  },
  {
    value: 'tcgplayer',
    label: 'TCGPlayer',
  },
  {
    value: 'cardmarket',
    label: 'Cardmarket',
  },
];

const LEGALITY_OPERATOR_OPTIONS: OperatorOption[] = [
  {
    operator: ':',
    label: 'Is legal in the format',
  },
  {
    operator: ':',
    label: 'Is not legal in the format',
    negate: true,
  },
];

type InputData = {
  value: string;
  operator: string;
  numeric?: boolean;
  negate?: boolean;
  error?: string;
};

interface SelectedTag extends TagOption {
  selected?: boolean;
}

type AutoCompleteOption = {
  value: string;
  label: string;
  alias?: RegExp;
};

type Data = {
  colorAutocompletes: AutoCompleteOption[];
  cards: InputData[];
  cardAmounts: InputData[];
  cardTypes: InputData[];
  oracleText: InputData[];
  cardKeywords: InputData[];
  manaValue: InputData[];
  colorIdentity: InputData[];
  prerequisites: InputData[];
  steps: InputData[];
  results: InputData[];
  tags: SelectedTag[];
  commanders: InputData[];
  popularity: InputData[];
  prices: InputData[];
  vendor: string;
  format: InputData[];
  validationError: string;
};

const AdvancedSearch: React.FC = () => {
  const router = useRouter();

  const [formState, setFormStateHook] = useState<Data>({
    colorAutocompletes: COLOR_AUTOCOMPLETES,
    cards: [{ ...CARD_OPERATOR_OPTIONS[0], value: '' }],
    cardAmounts: [{ ...CARD_AMOUNT_OPERATOR_OPTIONS[0], value: '' }],
    cardTypes: [{ ...CARD_TYPE_OPERATOR_OPTIONS[0], value: '' }],
    oracleText: [{ ...CARD_ORACLE_TEXT_OPERATOR_OPTIONS[0], value: '' }],
    cardKeywords: [{ ...CARD_KEYWORD_OPERATOR_OPTIONS[0], value: '' }],
    manaValue: [{ ...CARD_MANA_VALUE_OPERATOR_OPTIONS[0], value: '' }],
    colorIdentity: [{ ...COLOR_IDENTITY_OPERATOR_OPTIONS[0], value: '' }],
    prerequisites: [{ ...COMBO_DATA_OPERATOR_OPTIONS[0], value: '' }],
    steps: [{ ...COMBO_DATA_OPERATOR_OPTIONS[0], value: '' }],
    results: [{ ...RESULTS_OPERATOR_OPTIONS[0], value: '' }],
    tags: TAGS_OPTIONS.map((tag) => ({ ...tag })),
    commanders: [{ ...COMMANDER_OPTIONS[0], value: '' }],
    popularity: [{ ...POPULARITY_OPTIONS[0], value: '' }],
    prices: [{ ...PRICE_OPTIONS[0], value: '' }],
    vendor: DEFAULT_VENDOR,
    format: [{ ...LEGALITY_OPERATOR_OPTIONS[0], value: '' }],
    validationError: '',
  });

  const {
    colorAutocompletes,
    cards,
    cardAmounts,
    cardTypes,
    oracleText,
    cardKeywords,
    manaValue,
    colorIdentity,
    prerequisites,
    steps,
    results,
    tags,
    commanders,
    popularity,
    prices,
    vendor,
    format,
    validationError,
  } = formState;

  const setFormState = (changes: Partial<typeof formState>) => {
    setFormStateHook({ ...formState, ...changes });
  };

  const hasPriceInQuery = !!prices.find(({ value }) => !!value.trim());

  const validate = () => {
    let hasValidationError = false;

    const newFormState = { ...formState };

    function val(input: InputData) {
      input.error = '';

      if ((input.numeric ?? false) && !Number.isInteger(Number(input.value))) {
        input.error = 'Contains a non-integer. Use a full number instead.';
      }

      if (input.error) {
        hasValidationError = true;
      }
    }

    newFormState.cards.forEach(val);
    newFormState.cardAmounts.forEach(val);
    newFormState.cardTypes.forEach(val);
    newFormState.oracleText.forEach(val);
    newFormState.cardKeywords.forEach(val);
    newFormState.manaValue.forEach(val);
    newFormState.colorIdentity.forEach(val);
    newFormState.prerequisites.forEach(val);
    newFormState.steps.forEach(val);
    newFormState.results.forEach(val);
    newFormState.commanders.forEach(val);
    newFormState.popularity.forEach(val);
    newFormState.prices.forEach(val);
    setFormState(newFormState);
    return hasValidationError;
  };

  useEffect(() => {
    validate();
  }, [
    cards,
    cardAmounts,
    cardTypes,
    oracleText,
    cardKeywords,
    manaValue,
    colorIdentity,
    prerequisites,
    steps,
    results,
    tags,
    commanders,
    popularity,
    prices,
    vendor,
    format,
  ]);

  const getQuery = () => {
    let query = '';

    function makeQueryFunction(key: string): Parameters<typeof Array.prototype.forEach>[0] {
      return (input: InputData) => {
        let value = input.value.trim();
        const negated = input.negate ?? false;
        const numeric = input.numeric ?? false;
        const isSimpleValue = value.match(/^[\w\d]*$/);
        let operator = input.operator;
        let keyInQuery = key;
        const isSimpleCardValue = isSimpleValue && keyInQuery === 'card' && operator === ':' && !negated;

        if (!value) {
          return;
        }

        let quotes = '';

        if (!isSimpleValue) {
          quotes = '"';

          if (value.includes(quotes)) {
            // quotes = "'";
            value = value.replace(/"/g, '\\"');
          }
        }

        if (isSimpleCardValue) {
          keyInQuery = '';
          operator = '';
        } else if (numeric) {
          if (keyInQuery === 'ci') {
            keyInQuery = 'colors';
          } else if (keyInQuery === 'popularity') {
            keyInQuery = 'decks';
          } else if (keyInQuery === 'price') {
            keyInQuery = vendor;
          } else if (keyInQuery !== 'mv' && keyInQuery !== 'pre' && keyInQuery !== 'prereq') {
            keyInQuery += 's';
          }
        }
        if (negated) {
          keyInQuery = `-${keyInQuery}`;
        }

        query += ` ${keyInQuery}${operator}${quotes}${value}${quotes}`;
      };
    }

    function makeQueryFunctionForTags(): Parameters<typeof Array.prototype.forEach>[0] {
      return (tag: SelectedTag) => {
        if (tag.selected === true) {
          query += ` is:${tag.name}`;
        } else if (tag.selected === false) {
          query += ` -is:${tag.name}`;
        }
      };
    }
    cards.forEach(makeQueryFunction('card'));
    cardAmounts.forEach(makeQueryFunction('card'));
    cardTypes.forEach(makeQueryFunction('type'));
    oracleText.forEach(makeQueryFunction('oracle'));
    cardKeywords.forEach(makeQueryFunction('keyword'));
    manaValue.forEach(makeQueryFunction('mv'));
    colorIdentity.forEach(makeQueryFunction('ci'));
    prerequisites.forEach(makeQueryFunction('prereq'));
    steps.forEach(makeQueryFunction('step'));
    results.forEach(makeQueryFunction('result'));
    tags.forEach(makeQueryFunctionForTags());
    commanders.forEach(makeQueryFunction('commander'));
    popularity.forEach(makeQueryFunction('popularity'));
    prices.forEach(makeQueryFunction('price'));
    format.forEach(makeQueryFunction('legal'));

    query = query.trim();

    return query;
  };

  const query = getQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      return setFormState({
        validationError: 'Check for errors in your search terms before submitting.',
      });
    }

    router.push({
      pathname: '/search/',
      query: {
        q: `${query}`,
      },
    });
  };

  return (
    <>
      <SpellbookHead
        title="Commander Spellbook: Advanced Search"
        description="Advanced search form for searching through Commander Spellbook EDH combos."
      />
      <div className={`${styles.container} container`}>
        <ArtCircle cardName="Tribute Mage" className="m-auto md:block hidden" />
        <h1 className="heading-title">Advanced Search</h1>
        <p className="text-center">
          For more information on the syntax for searches,&nbsp;
          <Link href="/syntax-guide/">check out the Syntax Guide.</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div id="card-name-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={cards}
            onChange={(cards) => setFormState({ cards })}
            cardAutocomplete={true}
            label="Card Names"
            labelIcon="signature"
            operatorOptions={CARD_OPERATOR_OPTIONS}
          />
        </div>

        <div id="card-amount-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={cardAmounts}
            onChange={(cardAmounts) => setFormState({ cardAmounts })}
            label="Number of Cards"
            labelIcon="hashtag"
            pluralLabel="Number of Cards"
            operatorOptions={CARD_AMOUNT_OPERATOR_OPTIONS}
          />
        </div>

        <div id="card-type-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={cardTypes}
            onChange={(cardTypes) => setFormState({ cardTypes })}
            label="Card Type Line"
            labelIcon="seedling"
            pluralLabel="Card Type Lines"
            operatorOptions={CARD_TYPE_OPERATOR_OPTIONS}
          />
        </div>

        <div id="card-oracle-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={oracleText}
            onChange={(oracleText) => setFormState({ oracleText })}
            label="Oracle Text"
            labelIcon="fileLines"
            pluralLabel="Oracle Text"
            operatorOptions={CARD_ORACLE_TEXT_OPERATOR_OPTIONS}
          />
        </div>

        <div id="card-keywords-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={cardKeywords}
            onChange={(cardKeywords) => setFormState({ cardKeywords })}
            label="Card Keyword"
            labelIcon="key"
            pluralLabel="Card Keywords"
            operatorOptions={CARD_KEYWORD_OPERATOR_OPTIONS}
          />
        </div>

        <div id="card-mana-value-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={manaValue}
            onChange={(manaValue) => setFormState({ manaValue })}
            label="Mana Value"
            labelIcon="coins"
            pluralLabel="Card Mana Values"
            operatorOptions={CARD_MANA_VALUE_OPERATOR_OPTIONS}
          />
        </div>

        <div id="color-identity-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={colorIdentity}
            onChange={(colorIdentity) => setFormState({ colorIdentity })}
            label="Color Identity"
            labelIcon="palette"
            pluralLabel="Color Identities"
            operatorOptions={COLOR_IDENTITY_OPERATOR_OPTIONS}
            autocompleteOptions={colorAutocompletes}
            defaultPlaceholder="ex: wug, temur, colorless, black"
            useValueForAutocompleteInput
          />
        </div>

        <div id="prerequisite-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={prerequisites}
            onChange={(prerequisites) => setFormState({ prerequisites })}
            defaultPlaceholder="all permanents on the battlefield"
            label="Prerequisite"
            labelIcon="listCheck"
            operatorOptions={COMBO_DATA_OPERATOR_OPTIONS}
          />
        </div>

        <div id="step-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={steps}
            onChange={(steps) => setFormState({ steps })}
            label="Step"
            labelIcon="listOl"
            operatorOptions={COMBO_DATA_OPERATOR_OPTIONS}
          />
        </div>

        <div id="result-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={results}
            onChange={(results) => setFormState({ results })}
            resultAutocomplete={true}
            label="Result"
            labelIcon="infinity"
            operatorOptions={COMBO_DATA_OPERATOR_OPTIONS}
            defaultPlaceholder="ex: win the game"
          />
        </div>

        <div id="commander-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={commanders}
            onChange={(commanders) => setFormState({ commanders })}
            cardAutocomplete={true}
            label="Commander"
            labelIcon="commandZone"
            operatorOptions={COMMANDER_OPTIONS}
            defaultPlaceholder="ex: Codie, Vociferous Codex"
          />
        </div>

        <div id="popularity-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={popularity}
            onChange={(popularity) => setFormState({ popularity })}
            label="Popularity"
            labelIcon="arrowUpRightDots"
            pluralLabel="Popularity"
            operatorOptions={POPULARITY_OPTIONS}
          />
        </div>

        <div id="price-inputs" className={`${styles.container} container`}>
          <MultiSearchInput
            value={prices}
            onChange={(prices) => setFormState({ prices })}
            label="Price"
            labelIcon="dollarSign"
            pluralLabel="Price"
            operatorOptions={PRICE_OPTIONS}
          />
        </div>

        {hasPriceInQuery && (
          <div id="vendor" className={`${styles.container} container`}>
            <RadioSearchInput
              checkedValue={vendor}
              options={PRICE_VENDORS}
              formName="vendor"
              label="Card Vendor"
              labelIcon="cartShopping"
              onChange={(vendor) => setFormState({ vendor })}
            />
          </div>
        )}

        <div id="format" className={`${styles.container} container`}>
          <MultiSearchInput
            value={format}
            operatorOptions={LEGALITY_OPERATOR_OPTIONS}
            selectOptions={LEGALITY_FORMATS}
            label="Format"
            labelIcon="scaleBalanced"
            onChange={(format) => setFormState({ format })}
          />
        </div>

        {TAGS_OPTIONS.map((tagOption, i) => (
          <div id={`${tagOption.name}-tag`} className={`${styles.container} container`} key={i}>
            <RadioSearchInput
              checkedValue={tags.find((tag) => tag.name === tagOption.name)?.selected?.toString() ?? 'null'}
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
                { value: 'null', label: 'Either' },
              ]}
              formName={tagOption.name}
              label={tagOption.label}
              labelIcon={tagOption.labelIcon}
              onChange={(tag) => {
                const tagIndex = tags.findIndex((t) => t.name === tagOption.name);
                const newTag = {
                  ...tagOption,
                  selected: tag === 'null' ? undefined : tag === 'true',
                };
                setFormState({
                  tags: tagIndex === -1 ? tags.concat(newTag) : tags.map((t, i) => (i === tagIndex ? newTag : t)),
                });
              }}
            />
          </div>
        ))}

        <div className={`${styles.container} container text-center pb-8`}>
          <div className="flex flex-row items-center">
            <button id="advanced-search-submit-button" type="submit" className={styles.submitButton}>
              Search&nbsp;With&nbsp;Query
            </button>

            <div id="search-query" className={styles.searchQuery} aria-hidden="true">
              {query ? (
                <span>{query}</span>
              ) : (
                <span className={styles.suggestion}>
                  (your query will populate here when you've entered any search terms)
                </span>
              )}
            </div>
          </div>

          <div id="advanced-search-validation-error" className="text-danger p-4">
            {validationError}
          </div>
        </div>
      </form>
    </>
  );
};

export default AdvancedSearch;
