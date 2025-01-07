import React, { useState } from 'react';
import AutocompleteInput from '../../advancedSearch/AutocompleteInput/AutocompleteInput';
import { FeatureProducedInVariantSuggestionRequest } from '@spacecowmedia/spellbook-client';

type Props = {
  feature: FeatureProducedInVariantSuggestionRequest;
  onChange: (_feature: FeatureProducedInVariantSuggestionRequest) => void;
  onDelete: () => void;
  index: number;
};

const FeatureSubmission: React.FC<Props> = ({ feature, onChange, onDelete, index }) => {
  const [featureInput, setFeatureInput] = useState(feature.feature);

  const handleFeatureInputChange = (value: string) => {
    setFeatureInput(value);
    onChange({ feature: value });
  };

  return (
    <div className="border border-gray-250 rounded  flex-col p-5 shadow-lg mb-5 relative">
      <label className="font-bold">Feature Name:</label>
      <AutocompleteInput
        value={featureInput}
        onChange={handleFeatureInputChange}
        label="Template Name"
        inputClassName="border-dark"
        resultAutocomplete={true}
        inputId={index.toString()}
        placeholder="Search for a feature (ex: 'Infinite mana')..."
        // hasError={!!input.error}
        useValueForInput
        maxLength={256}
      />
      <button
        className="w-6 h-6 rounded-full flex justify-center text-white bg-red-900 font-bold absolute -right-2 -top-2 hover:scale-125 transform transition-all duration-200 ease-in-out"
        onClick={onDelete}
        title="Remove step from combo"
      >
        x
      </button>
    </div>
  );
};

export default FeatureSubmission;
