'use client';

import Icon from 'components/layout/Icon/Icon';
import React, { useEffect, useState } from 'react';
// import { useCookies } from 'react-cookie';

const DarkMode: React.FC = () => {
  // const [cookies, setCookies] = useCookies(['theme']);
  const [darkMode, setDarkMode] = useState('system');

  // useEffect(() => {
  //   if (cookies.theme && cookies.theme !== darkMode) {
  //     setDarkMode(cookies.theme);
  //   }
  // }, []);

  // const handlePreferenceChange = (e: MediaQueryListEvent) => {
  //   if (darkMode === 'system') {
  //     document.documentElement.classList.toggle('dark', e.matches);
  //   }
  // };

  useEffect(() => {
    // if (darkMode !== cookies.theme) {
    //   setCookies('theme', darkMode, {
    //     sameSite: 'strict',
    //     path: '/',
    //     expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    //   });
    // }
    if (darkMode !== 'system') {
      document.documentElement.classList.toggle('dark', darkMode === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, [darkMode]);

  // useEffect(() => {
  //   window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handlePreferenceChange);
  //   return () => {
  //     window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handlePreferenceChange);
  //   };
  // }, []);

  return (
    <>
      {darkMode == 'light' ? (
        <Icon name="sun" onClick={() => setDarkMode('dark')} />
      ) : darkMode == 'dark' ? (
        <Icon name="moon" onClick={() => setDarkMode('system')} />
      ) : (
        <Icon name="halfStrokeCircle" onClick={() => setDarkMode('light')} />
      )}
    </>
  );
};

export default DarkMode;
