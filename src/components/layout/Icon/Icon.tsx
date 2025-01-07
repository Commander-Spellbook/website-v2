import styles from './icon.module.scss';
import {
  faArrowUpRightDots,
  faArrowUpWideShort,
  faCartShopping,
  faCertificate,
  faCheckDouble,
  faCircleExclamation,
  faCircleInfo,
  faCircleXmark,
  faCode,
  faCoins,
  faDollarSign,
  faFileLines,
  faFingerprint,
  faHashtag,
  faInfinity,
  faKey,
  faEye,
  faLightbulb,
  faListCheck,
  faListOl,
  faPalette,
  faScaleBalanced,
  faSeedling,
  faSignature,
  faStar,
  faTags,
  faTriangleExclamation,
  faClose,
  faChevronLeft,
  faChevronRight,
  faClone,
  faCheck,
  faXmark,
  faSun,
  faMoon,
  faCircleHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';

const SPELLBOOK_ICONS = {
  graveyard: styles.graveyard,
  battlefield: styles.battlefield,
  commandZone: styles.commandZone,
  hand: styles.hand,
  library: styles.library,
  exile: styles.exile,
  archidekt: styles.archidekt,
};

const SPELLBOOK_FA_ICONS = {
  circleInfo: faCircleInfo,
  triangleExclamation: faTriangleExclamation,
  circleExclamation: faCircleExclamation,
  lightbulb: faLightbulb,
  circleXmark: faCircleXmark,
  star: faStar,
  signature: faSignature,
  hashtag: faHashtag,
  palette: faPalette,
  checkDouble: faCheckDouble,
  listCheck: faListCheck,
  listOl: faListOl,
  infinity: faInfinity,
  arrowUpRightDots: faArrowUpRightDots,
  dollarSign: faDollarSign,
  scaleBalanced: faScaleBalanced,
  certificate: faCertificate,
  cartShopping: faCartShopping,
  fingerprint: faFingerprint,
  tags: faTags,
  arrowUpWideShort: faArrowUpWideShort,
  seedling: faSeedling,
  fileLines: faFileLines,
  key: faKey,
  coins: faCoins,
  code: faCode,
  eye: faEye,
  close: faClose,
  chevronLeft: faChevronLeft,
  chevronRight: faChevronRight,
  copy: faClone,
  check: faCheck,
  cross: faXmark,
  sun: faSun,
  moon: faMoon,
  halfStrokeCircle: faCircleHalfStroke,
};

export type SpellbookIcon = keyof typeof SPELLBOOK_ICONS | keyof typeof SPELLBOOK_FA_ICONS;

type Props = {
  name: SpellbookIcon;
  className?: string;
  onClick?: () => void;
};

const Icon: React.FC<Props> = ({ name, className, onClick }) => {
  if (name in SPELLBOOK_ICONS) {
    return (
      <i
        className={classNames(styles.icon, SPELLBOOK_ICONS[name as keyof typeof SPELLBOOK_ICONS], className)}
        onClick={onClick}
      />
    );
  }
  if (name in SPELLBOOK_FA_ICONS) {
    return (
      <FontAwesomeIcon
        className={classNames(styles.icon, className)}
        icon={SPELLBOOK_FA_ICONS[name as keyof typeof SPELLBOOK_FA_ICONS]}
        onClick={onClick}
      />
    );
  }

  return null;
};

export default Icon;
