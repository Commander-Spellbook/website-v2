import AutocompleteInput from '../../advancedSearch/AutocompleteInput/AutocompleteInput';
import { useState } from 'react';
import Select, { MultiValue } from 'react-select';
import {
  CardUsedInVariantSuggestionRequest,
  TemplateRequiredInVariantSuggestionRequest,
  ZoneLocationsEnum,
} from '@spacecowmedia/spellbook-client';

const ZONE_OPTIONS = [
  { value: 'H', label: 'Hand' },
  { value: 'B', label: 'Battlefield' },
  { value: 'G', label: 'Graveyard' },
  { value: 'L', label: 'Library' },
  { value: 'E', label: 'Exile' },
  { value: 'C', label: 'Command Zone' },
];

type Props = {
  card?: CardUsedInVariantSuggestionRequest;
  template?: TemplateRequiredInVariantSuggestionRequest;
  onChange: (_card: CardUsedInVariantSuggestionRequest | TemplateRequiredInVariantSuggestionRequest) => void;
  onDelete: () => void;
  index: number;
};
const CardSubmission = ({ card, template, onChange, index, onDelete }: Props) => {
  if (card && template) {
    throw new Error('CardSubmission cannot have both a card and a template');
  }
  const cardOrTemplate = card || template;
  if (!cardOrTemplate) {
    throw new Error('CardSubmission must have either a card or a template');
  }

  const [nameInput, setNameInput] = useState(card?.card || '');
  const [templateInput, setTemplateInput] = useState(template?.template || '');

  const handleZoneChange = (zoneLocations: MultiValue<{ value: string; label: string }>) => {
    const newZoneList = zoneLocations.map((zone) => ZoneLocationsEnum[zone.value as keyof typeof ZoneLocationsEnum]);
    onChange({
      ...cardOrTemplate,
      zoneLocations: newZoneList,
      exileCardState: newZoneList.includes(ZoneLocationsEnum.E) ? cardOrTemplate.exileCardState : '',
      graveyardCardState: newZoneList.includes(ZoneLocationsEnum.G) ? cardOrTemplate.graveyardCardState : '',
      libraryCardState: newZoneList.includes(ZoneLocationsEnum.L) ? cardOrTemplate.libraryCardState : '',
      battlefieldCardState: newZoneList.includes(ZoneLocationsEnum.B) ? cardOrTemplate.battlefieldCardState : '',
    });
  };

  const handleTemplateInputChange = (value: string) => {
    setTemplateInput(value);
    onChange({ ...cardOrTemplate, template: value });
  };

  const handleCardInputChange = (value: string) => {
    setNameInput(value);
    onChange({ ...cardOrTemplate, card: value });
  };

  return (
    <div className="border border-gray-250 rounded  flex-col p-5 shadow-lg mb-5 relative">
      {template && (
        <>
          <label className="font-bold">Template Name:</label>
          <AutocompleteInput
            value={templateInput}
            onChange={handleTemplateInputChange}
            label="Template Name"
            inputClassName="border-dark"
            templateAutocomplete={true}
            inputId={index.toString()}
            placeholder="Search for a template (ex: 'Creature with haste') or type in a new one..."
            // hasError={!!input.error}
            useValueForInput
            maxLength={256}
          />
        </>
      )}

      {card && (
        <>
          <label className="font-bold">Card Name:</label>
          <AutocompleteInput
            value={nameInput}
            onChange={handleCardInputChange}
            label="Card Name"
            inputClassName="border-dark"
            cardAutocomplete={true}
            inputId={index.toString()}
            placeholder="Search for a card..."
            // hasError={!!input.error}
            useValueForInput
            maxLength={256}
          />
        </>
      )}

      <button
        className="w-6 h-6 rounded-full flex justify-center text-white bg-red-900 font-bold absolute -right-2 -top-2 hover:scale-125 transform transition-all duration-200 ease-in-out"
        onClick={onDelete}
        title="Remove card from combo"
      >
        x
      </button>
      <div>
        <label className="font-bold">Zone(s):</label>
        <Select
          placeholder="Select one or more zones that the card must be in..."
          isMulti
          options={ZONE_OPTIONS}
          onChange={handleZoneChange}
          value={cardOrTemplate.zoneLocations.map(
            (zone) => ZONE_OPTIONS.find((z) => z.value === zone) || { value: 'N/A', label: 'N/A' },
          )}
          className="inputControl"
          styles={{
            control: (base) => ({
              ...base,
              background: 'inherit',
            }),
            menu: (base) => ({
              ...base,
              background: 'inherit',
            }),
          }}
        />
      </div>

      {cardOrTemplate.zoneLocations.includes(ZoneLocationsEnum.E) && (
        <div>
          <label className="font-bold">Exile State (optional):</label>
          <input
            className="border border-gray-250 rounded p-1"
            value={cardOrTemplate.exileCardState}
            onChange={(e) => onChange({ ...cardOrTemplate, exileCardState: e.target.value })}
            placeholder="Exile state (ex: Exiled by...)"
          />
        </div>
      )}

      {cardOrTemplate.zoneLocations.includes(ZoneLocationsEnum.G) && (
        <div>
          <label className="font-bold">Graveyard State (optional):</label>
          <input
            className="border border-gray-250 rounded p-1"
            value={cardOrTemplate.graveyardCardState}
            onChange={(e) => onChange({ ...cardOrTemplate, graveyardCardState: e.target.value })}
            placeholder="Graveyard state (ex: Entered the graveyard this turn)"
          />
        </div>
      )}

      {cardOrTemplate.zoneLocations.includes(ZoneLocationsEnum.L) && (
        <div>
          <label className="font-bold">Library State (optional):</label>
          <input
            className="border border-gray-250 rounded p-1"
            value={cardOrTemplate.libraryCardState}
            onChange={(e) => onChange({ ...cardOrTemplate, libraryCardState: e.target.value })}
            placeholder="Library state (ex: On the top of your library)"
          />
        </div>
      )}

      {cardOrTemplate.zoneLocations.includes(ZoneLocationsEnum.B) && (
        <div>
          <label className="font-bold">Battlefield State (optional):</label>
          <input
            className="border border-gray-250 rounded p-1"
            value={cardOrTemplate.battlefieldCardState}
            onChange={(e) => onChange({ ...cardOrTemplate, battlefieldCardState: e.target.value })}
            placeholder="Battlefield state (ex: Untapped)"
          />
        </div>
      )}

      <div className="mt-8">
        <label className="cursor-pointer select-none mr-2" htmlFor={`quantity-input-${template ? 't' : 'c'}-${index}`}>
          Quantity:
        </label>
        <input
          className="mr-2 cursor-pointer border rounded-md"
          type="number"
          defaultValue="1"
          id={`quantity-input-${template ? 't' : 'c'}-${index}`}
          min="1"
          max="10"
          onChange={(e) => onChange({ ...cardOrTemplate, quantity: parseInt(e.target.value) })}
        />
      </div>

      <div className="mt-2">
        <input
          className="mr-2 cursor-pointer"
          id={`commander-checkbox-${template ? 't' : 'c'}-${index}`}
          checked={cardOrTemplate.mustBeCommander}
          onChange={() => onChange({ ...cardOrTemplate, mustBeCommander: !cardOrTemplate.mustBeCommander })}
          type="checkbox"
        />
        <label className="cursor-pointer select-none" htmlFor={`commander-checkbox-${template ? 't' : 'c'}-${index}`}>
          Must be commander?
        </label>
      </div>
    </div>
  );
};

export default CardSubmission;
