import { Plugin } from "@nuxt/types";

const fireauth: Plugin = (nuxt): Promise<void> => {
  const { store, $fire } = nuxt;

  return new Promise((resolve) => {
    $fire.auth.onAuthStateChanged((user) => {
      store.commit("auth/setUser", user);

      resolve();
    });
  });
};

export default fireauth;
