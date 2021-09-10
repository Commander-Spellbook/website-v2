import dotenv from "dotenv";
const isWindows = process.platform === "win32";

const title = "Commander Spellbook: The Search Engine for EDH Combos";
const description =
  "The Premier Magic: the Gathering Combo Search Engine for the Commander / Elder Dragon Highlander (EDH) Format.";
const linkPreviewImage = "https://commanderspellbook.com/link-preview.png";

dotenv.config();

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: "static",

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title,
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: description,
      },
      // Open Graph / Facebook
      {
        hid: "og-type",
        property: "og:type",
        content: "website",
      },
      {
        hid: "og-url",
        property: "og:url",
        content: "https://commanderspellbook.com/",
      },
      {
        hid: "og-title",
        property: "og:title",
        content: title,
      },
      {
        hid: "og-site_name",
        property: "og:site_name",
        content: title,
      },
      {
        hid: "og-description",
        property: "og:description",
        content: description,
      },
      {
        hid: "og-image",
        property: "og:image",
        content: linkPreviewImage,
      },
      // Twitter metatags
      {
        hid: "twitter-card",
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        hid: "twitter-url",
        name: "twitter:url",
        content: "https://commanderspellbook.com/",
      },
      {
        hid: "twitter-title",
        name: "twitter:title",
        content: title,
      },
      {
        hid: "twitter-description",
        name: "twitter:description",
        content: description,
      },
      {
        hid: "twitter-image",
        name: "twitter:image",
        content: linkPreviewImage,
      },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicons/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/favicons/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicons/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicons/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
      {
        rel: "search",
        type: "application/opensearchdescription+xml",
        title: "Commander Spellbook: The Search Engine for EDH Combos",
        href: "https://commanderspellbook.com/opensearch.xml",
      },
    ],
  },

  router: {
    trailingSlash: true,
    middleware: ["authenticated"],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["~/assets/global.css"],

  generate: { fallback: "404.html" },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {
      src: "./plugins/google-analytics.ts",
      mode: "client",
    },
    "~/plugins/vue-tooltip.ts",
    {
      src: "./plugins/fireauth.ts",
      mode: "client",
    },
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/stylelint
    "@nuxtjs/stylelint-module",
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    "@nuxtjs/google-fonts",
    "vue-social-sharing/nuxt",
    "@nuxtjs/firebase",
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  firebase: {
    config: {
      apiKey:
        process.env.FIREBASE_API_KEY ||
        "AIzaSyDbLy6q09rqCgwMEssOGj2OxYyD8bSegXw",
      authDomain:
        process.env.FIREBASE_AUTH_DOMAIN ||
        "commander-spellbook-local.firebaseapp.com",
      projectId: process.env.FIREBASE_PROJECT_ID || "commander-spellbook-local",
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET ||
        "commander-spellbook-local.appspot.com",
      messagingSenderId:
        process.env.FIREBASE_MESSAGING_SENDER_ID || "766592582304",
      appId:
        process.env.FIREBASE_APP_ID ||
        "1:766592582304:web:d55f27537ea02d05457fc5",
      // measurementId: '<measurementId>'
    },
    services: {
      auth: true,
    },
  },

  tailwindcss: {
    jit: !isWindows,
  },

  googleFonts: {
    families: {
      "Josefin+Sans": [400],
      Roboto: [400, 700],
    },
  },
};
