import React, { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './searchBar.module.scss';
import { NextRouter, useRouter } from 'next/router';
import UserDropdown from '../layout/UserDropdown/UserDropdown';
import { apiConfiguration } from 'services/api.service';
import { VariantsApi } from '@spacecowmedia/spellbook-client';
import DarkMode from 'components/ui/DarkMode/DarkMode';
import { useCookies } from 'react-cookie';

type Props = {
  onHomepage?: boolean;
  className?: string;
};

const countUpToString = (count: number) => {
  const countString = count.toString();
  const countLength = countString.length;

  if (countLength < 5) {
    return '0'.repeat(5 - countLength) + countString;
  }

  return countString;
};

function getQueryFromRouter(router: NextRouter): string {
  if (router.query.q) {
    if (Array.isArray(router.query.q)) {
      return router.query.q[0];
    } else {
      return router.query.q;
    }
  }
  return '';
}

const SearchBar: React.FC<Props> = ({ onHomepage, className }) => {
  const configuration = apiConfiguration();
  const variantsApi = new VariantsApi(configuration);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const initialCount = 20000;
  const countUpRef = useRef<number>(initialCount);

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(getQueryFromRouter(router));
  const [cookies, setCookies] = useCookies(['variantCount']);
  const [variantCount, setVariantCount] = useState<number>(initialCount);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (typeof inputValue === 'string' && inputValue.trim()) {
      router.push(`/search/?q=${encodeURIComponent(inputValue)}`);
    }
  };

  const handleCountUp = (target: number) => {
    if (!inputRef.current) {
      return;
    }
    if (countUpRef.current < target) {
      const increment = (target - initialCount) / 50;
      countUpRef.current += Math.floor((1 + Math.random()) * increment);
      inputRef.current.placeholder = `Search ${countUpToString(countUpRef.current)} EDH combos`;
      setTimeout(() => handleCountUp(target), 50);
    } else {
      inputRef.current.placeholder = `Search ${target} EDH combos`;
    }
  };

  useEffect(() => {
    setInputValue(getQueryFromRouter(router));
  }, [router.query.q]);

  useEffect(() => {
    if (cookies.variantCount) {
      setVariantCount(cookies.variantCount);
      handleCountUp(cookies.variantCount);
    } else if (!cookies.variantCount) {
      variantsApi
        .variantsList({ limit: 1, q: 'legal:commander' })
        .then((response) => {
          setCookies('variantCount', response.count, { path: '/', maxAge: 3 * 60 * 60 });
          setVariantCount(response.count);
          handleCountUp(response.count);
        })
        .catch((_error) => {
          setVariantCount(0);
        });
    }
  }, []);

  return (
    <div className={`${styles.outerContainer} ${className}`}>
      <form onSubmit={handleSubmit} className={styles.mainSearchInputContainer}>
        {!onHomepage && (
          <Link href="/" className="block mr-2 flex-shrink py-1">
            <div className="mr-1">
              <img src="/images/gear.svg" alt="Go to home page" className="w-8 inline-block" />
            </div>
          </Link>
        )}

        <div className="flex flex-grow items-center">
          {!onHomepage && <button className={styles.searchInputIcon} type="submit" />}
          <label htmlFor="search-bar-input" className="sr-only text-white" aria-hidden="true">
            Combo Search
          </label>
          <input
            value={inputValue}
            name="q"
            ref={inputRef}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Search ${variantCount} EDH combos`}
            id="search-bar-input"
            type="text"
            className={`${styles.mainSearchInput} ${onHomepage ? 'text-2xl text-center' : 'pl-8 -ml-6 text-white'}`}
          />
        </div>

        {!onHomepage && (
          <div className="flex flex-row-reverse md:flex-row items-center desktop-menu">
            <button
              id="search-bar-menu-button"
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => setMobileMenuIsOpen(!mobileMenuIsOpen)}
            >
              <div className={`${styles.menuIcon} ${styles.linkIcon}`} aria-hidden="true" />
              <div className="sr-only">Menu</div>
            </button>

            <span className={`text-white mr-2`}>
              <DarkMode />
            </span>
            <Link href="/advanced-search/" className={`hidden md:flex ${styles.menuLink}`}>
              <div className={`${styles.advancedSearchIcon} ${styles.linkIcon}`} aria-hidden="true" />
              Advanced
            </Link>
            <Link href="/syntax-guide/" className={`hidden md:flex ${styles.menuLink}`}>
              <div className={`${styles.syntaxGuideIcon} ${styles.linkIcon}`} aria-hidden="true" />
              Syntax
            </Link>
            <Link href="/random" className={`hidden md:flex ${styles.menuLink}`}>
              <div className={`${styles.randomIcon} ${styles.linkIcon}`} aria-hidden="true" />
              Random
            </Link>
            <div className={styles.buttonContainer}>
              <UserDropdown />
            </div>
          </div>
        )}
      </form>

      {!onHomepage && mobileMenuIsOpen && (
        <div
          className="md:hidden flex flex-wrap flex-row text-center mt-2 py-4 border-t border-light text-light"
          onClick={() => setMobileMenuIsOpen(!mobileMenuIsOpen)}
        >
          <Link href="/advanced-search/" className={styles.mobileMenuButton}>
            <div className={`${styles.advancedSearchIcon} ${styles.linkIcon}`} aria-hidden="true" />
            Advanced
          </Link>
          <Link href="/syntax-guide/" className={styles.mobileMenuButton}>
            <div className={`${styles.syntaxGuideIcon} ${styles.linkIcon}`} aria-hidden="true" />
            Syntax
          </Link>
          <Link href="/random" className={styles.mobileMenuButton}>
            <div className={`${styles.randomIcon} ${styles.linkIcon}`} aria-hidden="true" />
            Random
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
