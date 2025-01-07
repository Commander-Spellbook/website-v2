import React from 'react';
import Link from 'next/link';
import styles from './footer.module.scss';
import Image from 'next/image';

type Props = {
  className?: string;
  noMargin?: boolean;
};

const Footer: React.FC<Props> = ({ className, noMargin }) => {
  return (
    <div className={`${className} ${noMargin && 'mt-0 lg:mt-0'}`}>
      {!noMargin && (
        <div className="relative md:-mt-24 lg:-mt-48">
          <Image className="w-full select-none" height="100" width="2000" src="/footer.svg" alt="footer" />
        </div>
      )}
      <footer className={styles.footer}>
        <div className="container md:flex flex-row text-center md:text-left">
          <div className={styles.linkCollection}>
            <h3 className={styles.header}>Combos</h3>
            <Link href="/advanced-search/">Advanced Search</Link>
            <Link href="/syntax-guide/">Syntax Guide</Link>
            <Link href="/random/">Random Combo</Link>
            <Link href="/find-my-combos/">Find My Combos</Link>
          </div>
          <div className={styles.linkCollection}>
            <h3 className={styles.header}>Commander Spellbook</h3>
            <Link href="/about/">About</Link>
            <Link href="/submit-a-combo/">Combo Submission</Link>
            <Link href="/style-guide/">Combo Style Guide</Link>
            <Link href="/report-error/">Report an Error with a Combo</Link>
            <Link href="/privacy-policy/">Privacy Policy</Link>
            <Link href="/login/?final=">Login</Link>
          </div>
          <div className={styles.linkCollection}>
            <h3 className={styles.header}>Community</h3>
            <a href="https://www.patreon.com/commanderspellbook">Patreon</a>
            <a href="https://discord.gg/DkAyVJG">Discord</a>
            <a href="https://twitter.com/CommanderSpell">Twitter</a>
            <a href="https://github.com/EDHREC/commander-spellbook-site">Github</a>
            <a href="https://edhrec.com/combos">EDHREC</a>
            <a href="https://draftsim.com">Draftsim</a>
            <a href="https://psycatgames.com/games/life-counter/">MTG Life Counter: Lotus</a>
          </div>
        </div>
        <div className="container mt-8 text-light">
          <p className="my-4">
            Commander Spellbook is unofficial Fan Content permitted under the&nbsp;
            <a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>. Not
            approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards
            of the Coast LLC.
          </p>
          <p className="my-4">
            Commander Spellbook utilizes icons provided by&nbsp;
            <a href="https://fontawesome.com/">Font Awesome</a> according to the&nbsp;
            <a href="https://fontawesome.com/license">Font Awesome License</a>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
