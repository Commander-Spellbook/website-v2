import React from 'react';
import SearchMessage from '../components/search/SearchMessage/SearchMessage';
import StyledSelect, { Option } from '../components/layout/StyledSelect/StyledSelect';
import { useRouter } from 'next/router';
import { DEFAULT_ORDER, DEFAULT_ORDERING, DEFAULT_SORT } from '../lib/constants';
import SearchPagination from '../components/search/SearchPagination/SearchPagination';
import ComboResults from '../components/search/ComboResults/ComboResults';
import NoCombosFound from '../components/layout/NoCombosFound/NoCombosFound';
import SpellbookHead from '../components/SpellbookHead/SpellbookHead';
import { GetServerSideProps } from 'next';
import ArtCircle from 'components/layout/ArtCircle/ArtCircle';
import { Variant, VariantsApi } from '@spacecowmedia/spellbook-client';
import { apiConfiguration } from 'services/api.service';
import { queryParameterAsString } from 'lib/queryParameters';

const PAGE_SIZE = 50;

type Props = {
  combos: Variant[];
  bannedCombos?: Variant[];
  count: number;
  page: number;
  error?: string;
  featured?: boolean;
};

const SORT_OPTIONS: Option[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'identity_count', label: 'Color Identity' },
  { value: 'variant_count', label: 'Number of Variants' },
  { value: 'price_tcgplayer', label: 'Price (TCGPlayer)' },
  { value: 'price_cardkingdom', label: 'Price (CardKingdom)' },
  { value: 'price_cardmarket', label: 'Price (Cardmarket)' },
  {
    value: 'card_count',
    label: '# of Cards',
  },
  {
    value: 'result_count',
    label: '# of Results',
  },
  {
    value: 'created',
    label: 'Date Created',
  },
  {
    value: 'updated',
    label: 'Date Updated',
  },
];

const ORDER_OPTIONS: Option[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

const AUTO_SORT_MAP: Record<string, '-'> = {
  popularity: '-',
  created: '-',
  updated: '-',
  variant_count: '-',
};

const doesQuerySpecifyFormat = (query: string): boolean => {
  return query.includes('legal:') || query.includes('banned:') || query.includes('format:');
};

const Search: React.FC<Props> = ({ combos, count, page, bannedCombos, error, featured }) => {
  const router = useRouter();

  const sort = queryParameterAsString(router.query.sort) || DEFAULT_SORT;
  const order = queryParameterAsString(router.query.order) || DEFAULT_ORDER;

  const query = queryParameterAsString(router.query.q) || '';

  const variant = queryParameterAsString(router.query.variant);

  const groupBy = queryParameterAsString(router.query.groupByCombo) !== 'false';

  const totalPages = Math.ceil(count / PAGE_SIZE);

  const pageNumber = Number(page) || 1;

  const goForward = () => {
    router.push({ pathname: '/search/', query: { ...router.query, page: pageNumber + 1 } });
  };

  const goBack = () => {
    router.push({ pathname: '/search/', query: { ...router.query, page: pageNumber - 1 } });
  };

  const handleSortChange = (value: string) => {
    router.push({ pathname: '/search/', query: { ...router.query, sort: value, page: '1' } });
  };

  const handleOrderChange = (value: string) => {
    router.push({ pathname: '/search/', query: { ...router.query, order: value, page: '1' } });
  };

  const handleGroupByComboChange = (value: string) => {
    router.push({ pathname: '/search/', query: { ...router.query, groupByCombo: value, page: '1' } });
  };

  const handleClearVariant = () => {
    router.push({ pathname: '/search/', query: { ...router.query, variant: undefined, page: '1' } });
  };

  const legalityMessage = doesQuerySpecifyFormat(query) ? '' : ' (legal:commander has been applied by default)';

  const singleCardQuery = /^card="([^"]+)"$/.exec(query);

  const searchMessage =
    (singleCardQuery
      ? `Showing ${count} combos with the card "${singleCardQuery[1]}"${legalityMessage}`
      : `Showing ${count} results for query "${query}"${legalityMessage}`) +
    (variant ? `, which are all variants of the combo with ID "${variant}"` : '');

  return (
    <>
      <SpellbookHead
        title="Commander Spellbook: Search Results"
        description="Search results for all EDH combos matching your query."
      />
      <div>
        {featured ? (
          <>
            <ArtCircle cardName="Thespian's Stage" className="m-auto md:block hidden my-8" />
            <h1 className="heading-title">Featured Combos</h1>
          </>
        ) : (
          <>
            {singleCardQuery ? (
              <h1 className="heading-title">Combos with "{singleCardQuery[1]}"</h1>
            ) : (
              <h1 className="sr-only">Search Results</h1>
            )}
            <SearchMessage
              message={error ? '' : searchMessage}
              errors={error ?? ''}
              currentPage={page}
              totalPages={1}
              totalResults={1}
              maxNumberOfCombosPerPage={1}
            />
          </>
        )}

        {combos.length > 0 && (
          <div className="border-b border-light">
            <div className="container sm:flex flex-row items-center justify-center">
              <div className="mr-2 sm:mt-0 mt-2" aria-hidden="true">
                Sorted by
              </div>
              <StyledSelect
                value={sort}
                id="sort-combos-select"
                onChange={handleSortChange}
                selectBackgroundClassName="border-dark border-2 my-2 sm:mr-2"
                label="Change how combos are sorted"
                options={SORT_OPTIONS}
              />
              <div className="mx-1 hidden sm:block" aria-hidden="true">
                :
              </div>
              <StyledSelect
                id="order-combos-select"
                value={order}
                onChange={handleOrderChange}
                selectBackgroundClassName="border-dark border-2 sm:m-2"
                label="Change sort direction, ascending or descending"
                options={ORDER_OPTIONS}
              />
              <div className="mr-2 sm:mt-0 mt-2" aria-hidden="true">
                Variants grouped by combo
              </div>
              <StyledSelect
                id="group-by-combo-select"
                value={groupBy ? 'true' : 'false'}
                onChange={handleGroupByComboChange}
                selectBackgroundClassName="border-dark border-2 my-2 sm:mr-2"
                label="Group variants by combo"
                options={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' },
                ]}
              />
              {variant && (
                <button onClick={handleClearVariant} className="">
                  Clear Variant Filter
                </button>
              )}
              <div className="flex-grow min-h-2" />
              {totalPages > 1 && (
                <>
                  <SearchPagination
                    currentPage={pageNumber}
                    totalPages={totalPages}
                    aria-hidden="true"
                    onGoForward={goForward}
                    onGoBack={goBack}
                  />
                </>
              )}
            </div>
          </div>
        )}

        <div className="container sm:flex flex-row">
          {combos.length > 0 ? (
            <div className="w-full">
              <ComboResults results={combos} sort={sort} hideVariants={!groupBy} />
              <SearchPagination
                currentPage={pageNumber}
                totalPages={totalPages}
                aria-hidden="true"
                onGoForward={goForward}
                onGoBack={goBack}
              />
            </div>
          ) : featured ? (
            <div>
              <p>No featured combos at this time!</p>
            </div>
          ) : (
            <NoCombosFound alternatives={bannedCombos} criteria="banned" />
          )}
        </div>
      </div>
    </>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async (context) => {
  let query = queryParameterAsString(context.query.q) ?? '';
  const isFeatured = query === 'is:featured';
  let isQueryMissingFormat = !doesQuerySpecifyFormat(query);
  const variant = queryParameterAsString(context.query.variant);
  if (isQueryMissingFormat && !variant) {
    query = `${query} legal:commander`;
  }
  const order = queryParameterAsString(context.query.order) || DEFAULT_ORDER;
  const sort = queryParameterAsString(context.query.sort) || DEFAULT_SORT;
  const ordering =
    (order === 'auto' ? `${AUTO_SORT_MAP[sort as string] || ''}${sort}` : `${order === 'asc' ? '' : '-'}${sort}`) +
    `,${DEFAULT_ORDERING}`;
  const groupByCombo = queryParameterAsString(context.query.groupByCombo)?.toLowerCase() !== 'false';
  const configuration = apiConfiguration(context);
  const variantsApi = new VariantsApi(configuration);
  try {
    const results = await variantsApi.variantsList({
      q: query,
      groupByCombo: groupByCombo,
      variant: variant,
      limit: PAGE_SIZE,
      offset: ((Number(queryParameterAsString(context.query.page)) || 1) - 1) * PAGE_SIZE,
      ordering: ordering,
    });

    const backendCombos = results.results;

    if (backendCombos.length === 0 && isQueryMissingFormat) {
      // Try searching in banned combos
      query = query.replaceAll('legal:', 'banned:');
      const results = await variantsApi.variantsList({
        q: query,
        groupByCombo: groupByCombo,
        variant: variant,
        limit: PAGE_SIZE,
        ordering: ordering,
      });
      const bannedCombos = results ? results.results : [];
      if (bannedCombos.length > 0) {
        return {
          props: {
            combos: [],
            bannedCombos: bannedCombos,
            count: 0,
            page: context.query.page || 1,
          },
        };
      }
    }

    if (backendCombos.length === 1 && (context.query.page || '1') === '1') {
      return {
        redirect: {
          destination: `/combo/${backendCombos[0].id}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        combos: backendCombos,
        featured: isFeatured,
        count: results.count,
        page: context.query.page || 1,
      },
    };
  } catch (error: any) {
    return {
      props: {
        combos: [],
        count: 0,
        page: context.query.page || 1,
        error: Object.hasOwn(error, 'q') && error.q ? error.q : 'An error occurred while searching for combos.',
      },
    };
  }
};
