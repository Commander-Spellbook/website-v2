import styles from './comboResults.module.scss';
import Link from 'next/link';
import ColorIdentity from '../../layout/ColorIdentity/ColorIdentity';
import CardTooltip from '../../layout/CardTooltip/CardTooltip';
import TextWithMagicSymbol from '../../layout/TextWithMagicSymbol/TextWithMagicSymbol';
import pluralize from 'pluralize';
import { Deck, Variant, VariantPrices } from '@spacecowmedia/spellbook-client';
import React from 'react';

type ResultProps = {
  decklist?: Map<string, number>; // If passed in, will highlight cards in the combo that are not in the deck
  decklistMessage?: string;
  combo: Variant;
  sort?: string;
  newTab?: boolean;
  hideVariants?: boolean;
};

export const ComboResult: React.FC<ResultProps> = ({
  combo,
  decklist,
  sort,
  newTab,
  hideVariants,
  decklistMessage,
}) => {
  const sortStatMessage = (combo: Variant) => {
    if (!sort) {
      return '';
    }

    if (sort === 'popularity') {
      const numberOfDecks = combo.popularity;

      if (numberOfDecks === null || numberOfDecks === undefined) {
        return 'No deck data (EDHREC)';
      }

      const deckString = pluralize('deck', numberOfDecks);

      return `${numberOfDecks} ${deckString} (EDHREC)`;
    }

    if (sort.startsWith('price')) {
      if (sort.includes('cardkingdom')) {
        return `$${combo.prices.cardkingdom}`;
      }
      if (sort.includes('cardmarket')) {
        return `€${combo.prices.cardmarket}`;
      }
      return `$${combo.prices.tcgplayer}`;
    }

    // switch (sort) {
    //   case "uses":
    //   case "steps":
    //   case "produces":
    //     if (combo[sort].length === 1) {
    //       // remove the s in the sort word
    //       return `1 ${sort.slice(0, -1)}`;
    //     }
    //     return `${combo[sort].length} ${results.sort}`;
    // }

    return '';
  };

  const prereqCount = combo.otherPrerequisites
    ? combo.otherPrerequisites.split('.').filter((s) => s.trim().length).length
    : 0;

  return (
    <Link
      href={`/combo/${combo.id}`}
      key={combo.id}
      className={`${styles.comboResult} w-full md:w-1/4`}
      rel={newTab ? 'noopener noreferrer' : undefined}
      target={newTab ? '_blank' : undefined}
    >
      <div className="flex flex-col">
        <div
          className={`flex items-center flex-grow flex-col ${combo.status === 'OK' ? 'bg-dark' : combo.status === 'E' ? 'bg-[#888888]' : 'bg-light'} text-white`}
        >
          <ColorIdentity identity={combo.identity} size="small" />
        </div>
        <div className={`flex-grow  ${styles.comboResultSection}`}>
          <div className="py-1">
            <span className="sr-only">Cards in combo:</span>
            {combo.uses.map(({ card, quantity }) => (
              <CardTooltip cardName={quantity > 1 ? `${quantity}x ${card.name}` : card.name} key={card.name}>
                <div className="card-name pl-3 pr-3">
                  {decklist && quantity - (decklist.get(card.name.toLowerCase()) ?? 0) > 0 ? (
                    decklistMessage != undefined ? (
                      <strong className="text-blue-800">
                        {card.name}
                        {decklistMessage ? ` (${decklistMessage})` : ''}
                      </strong>
                    ) : (
                      <strong className="text-red-800">{card.name} (not in deck)</strong>
                    )
                  ) : (
                    <span>{card.name}</span>
                  )}
                </div>
              </CardTooltip>
            ))}
            {combo.requires.length > 0 && (
              <div className={`${styles.prerequisites} pl-3 pr-3`}>
                <span>
                  +{combo.requires.reduce((q, r) => q + r.quantity, 0)} other card
                  {combo.requires.reduce((q, r) => q + r.quantity, 0) > 1 ? 's' : ''}
                </span>
              </div>
            )}
            {prereqCount > 0 && (
              <div className={`${styles.prerequisites} pl-3 pr-3`}>
                <span>
                  +{prereqCount} other prerequisite{prereqCount > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-grow">
          <span className="sr-only">Results in combo:</span>
          {combo.produces.map((result) => (
            <div key={result.feature.name} className={`result pl-3 pr-3`}>
              <TextWithMagicSymbol text={result.feature.name} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center flex-grow flex-col">
        <div className="flex-grow" />
        {!hideVariants && combo.variantCount > 1 && (
          <div className={styles.variantBanner}>
            <span className="pl-3 pr-3">
              + {combo.variantCount - 1} variant{combo.variantCount > 2 ? 's' : ''}
            </span>
          </div>
        )}
        {sortStatMessage(combo) && (
          <div className="sort-footer w-full py-1 text-center flex-shrink bg-dark text-white">
            {sortStatMessage(combo)}
          </div>
        )}
      </div>
    </Link>
  );
};

type Props = {
  deck?: Deck; // If passed in, will highlight cards in the combo that are not in the deck
  decklistMessage?: string;
  results: Variant[];
  sort?: string;
  vendor?: Array<keyof VariantPrices>;
  hideVariants?: boolean;
};

const ComboResults: React.FC<Props> = ({ results, sort, deck, hideVariants, decklistMessage }) => {
  const decklist = deck?.main.concat(deck.commanders).reduce((acc, card) => {
    const lowercase = card.card.toLowerCase();
    acc.set(lowercase, (acc.get(lowercase) ?? 0) + card.quantity);
    return acc;
  }, new Map<string, number>());

  return (
    <div className={styles.comboResultsWrapper}>
      {results.map((combo) => (
        <ComboResult
          combo={combo}
          decklist={decklist}
          sort={sort}
          key={combo.id}
          hideVariants={hideVariants}
          decklistMessage={decklistMessage}
        />
      ))}
    </div>
  );
};

export default ComboResults;
