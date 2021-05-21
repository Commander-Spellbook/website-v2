import fs from "fs";
import normalizeCardName from "../../lib/normalize-card-name";
import log from "../shared/log";
import getScryfallData from "./get-scryfall";
import isFeatured from "./is-featured";
import getEDHRECPrices from "./get-edhrec-prices";
import getEDHRECComboData from "./get-edhrec-combo-data";
import getGoogleSheetsComboData from "./get-google-sheets-data";
import { collectCardNames, collectResults } from "./collect-autocomplete";

type CardData = {
  f?: 1; // whether the combo should be featured
  b?: 1; // whether the combo is banned in commander
  s?: 1; // whether the combo is a preview for an upcoming set
  i: {
    // images
    o: string; // oracle
    a: string; // art
  };
  p: {
    // prices
    t: number; // tcgplayer
    c: number; // cardkingdom
  };
  e: string; // edhrec permalink for card
};

Promise.all([
  getGoogleSheetsComboData(),
  getScryfallData(),
  getEDHRECPrices(),
  getEDHRECComboData(),
]).then((responses) => {
  const cardData: Record<string, CardData> = {};
  const [compressedData, scryfallData, edhrecPriceData, edhrecComboData] =
    responses;
  const cardNames = collectCardNames(compressedData);
  const results = collectResults(compressedData);

  log("Writing /autocomplete-data/cards.json");
  fs.writeFileSync("./autocomplete-data/cards.json", JSON.stringify(cardNames));
  log("/autocomplete-data/cards.json written", "green");

  log("Writing /autocomplete-data/results.json");
  fs.writeFileSync("./autocomplete-data/results.json", JSON.stringify(results));
  log("/autocomplete-data/results.json written", "green");

  cardNames.forEach((autocompleteOption) => {
    const name = normalizeCardName(autocompleteOption.label);
    const sfData = scryfallData[name];
    const priceData = edhrecPriceData[name] || {
      prices: { tcgplayer: 0, cardkingdom: 0 },
    };

    try {
      cardData[name] = {
        p: {
          t: priceData.prices.tcgplayer,
          c: priceData.prices.cardkingdom,
        },
        i: {
          o: sfData.images.oracle,
          a: sfData.images.artCrop,
        },
        e: sfData.edhrecPermalink,
      };

      if (isFeatured(sfData)) {
        cardData[name].f = 1;
      }

      if (sfData.isBanned) {
        cardData[name].b = 1;
      }
      if (sfData.isPreview) {
        cardData[name].s = 1;
      }
    } catch (e) {
      log(
        `"${name}" could not be found in Scryfall's data. It's possible the name is misspelled. Skipping it when creating card data.`,
        "red"
      );
    }
  });

  log("Writing /external-data/cards.json");
  fs.writeFileSync("./external-data/cards.json", JSON.stringify(cardData));
  log("/external-data/cards.json written", "green");

  log("Writing /external-data/edhrec-combos.json");
  fs.writeFileSync(
    "./external-data/edhrec-combos.json",
    JSON.stringify(edhrecComboData)
  );
  log("/external-data/edhrec-combos.json written", "green");

  log("Writing /static/api/combo-data.json");
  fs.writeFileSync(
    "./static/api/combo-data.json",
    JSON.stringify(compressedData)
  );
  log("/static/api/combo-data.json written", "green");
});
