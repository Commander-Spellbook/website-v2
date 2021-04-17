import CardGrouping from "./models/card-grouping";
import SpellbookList from "./models/list";
import ColorIdentity from "./models/color-identity";
import type { CompressedApiResponse, FormattedApiResponse } from "./types";

export default function formatApiResponse(
  apiResponse: CompressedApiResponse[]
): FormattedApiResponse[] {
  return apiResponse.map((combo) => {
    const id = combo.d;
    const cards = CardGrouping.create(combo.c);
    const colorIdentity = new ColorIdentity(combo.i);
    const prerequisites = SpellbookList.create(combo.p);
    const steps = SpellbookList.create(combo.s);
    const results = SpellbookList.create(combo.r);
    const hasBannedCard = combo.b === 1;
    const hasSpoiledCard = combo.o === 1;

    return {
      commanderSpellbookId: id,
      permalink: `https://commanderspellbook.com/combo/${id}/`,
      cards,
      colorIdentity,
      prerequisites,
      steps,
      results,
      hasBannedCard,
      hasSpoiledCard,
    };
  });
}
