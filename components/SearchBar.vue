<template>
  <div class="outer-container">
    <form class="main-search-input-container" @submit.prevent="onSubmit">
      <nuxt-link v-if="!onHomePage" to="/" class="block mr-2 flex-shrink py-1">
        <div class="mr-1">
          <img
            src="~/assets/images/gear.svg"
            alt="Go to home page"
            class="w-8 inline-block"
          />
        </div>
      </nuxt-link>

      <div class="flex flex-grow items-center">
        <div
          v-if="!onHomePage"
          class="search-input-icon"
          aria-hidden="true"
          @click="focusSearch"
        ></div>
        <label
          for="search-bar-input"
          class="sr-only text-white"
          aria-hidden="true"
          >Combo Search</label
        >
        <input
          id="search-bar-input"
          ref="searchInput"
          v-model="query"
          type="text"
          class="main-search-input"
          :class="inputClasses"
          name="q"
          :placeholder="`Search ${numberOfCombos} EDH combos`"
          autocomplete="off"
          autocapitalize="none"
          autocorrect="off"
          spellcheck="false"
          :autofocus="onHomePage"
        />
      </div>
      <div v-if="!onHomePage" class="flex flex-shrink flex-row items-center">
        <button
          id="search-bar-menu-button"
          type="button"
          class="mobile-menu-button"
          @click="toggleMenu"
        >
          <div class="menu-icon link-icon" aria-hidden="true"></div>
          <div class="sr-only">Menu</div>
        </button>
        <nuxt-link to="/advanced-search/" class="hidden md:flex menu-link">
          <div class="advanced-search-icon link-icon" aria-hidden="true"></div>
          Advanced
        </nuxt-link>
        <nuxt-link to="/syntax-guide/" class="hidden md:flex menu-link">
          <div class="syntax-guide-icon link-icon" aria-hidden="true"></div>
          Syntax
        </nuxt-link>
        <RandomButton :query="query" class="hidden md:flex menu-link">
          <div class="random-icon link-icon" aria-hidden="true"></div>
          Random
        </RandomButton>
        <nuxt-link
          v-show="isAuthenticated"
          ref="profile-link"
          to="/profile/"
          class="hidden md:flex menu-link"
          ><div class="profile-icon link-icon mr-0"></div>
          <span class="sr-only">Profile</span></nuxt-link
        >
      </div>
    </form>
    <div
      v-if="!onHomePage && showMobileMenu"
      class="
        md:hidden
        flex flex-wrap flex-row
        text-center
        mt-2
        py-4
        border-t border-light
        text-light
      "
      @click="toggleMenu"
    >
      <nuxt-link to="/advanced-search/" class="mobile-menu-button">
        <div class="advanced-search-icon link-icon" aria-hidden="true"></div>
        Advanced
      </nuxt-link>
      <nuxt-link to="/syntax-guide/" class="mobile-menu-button">
        <div class="syntax-guide-icon link-icon" aria-hidden="true"></div>
        Syntax
      </nuxt-link>
      <RandomButton :query="query" class="mobile-menu-button">
        <div class="random-icon link-icon" aria-hidden="true"></div>
        Random
      </RandomButton>

      <nuxt-link
        v-show="isAuthenticated"
        ref="mobile-profile-link"
        to="/profile/"
        class="mobile-menu-button"
        ><div class="profile-icon link-icon"></div>
        Profile</nuxt-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RandomButton from "@/components/RandomButton.vue";
import getAllCombos from "@/lib/api/get-all-combos";

export default Vue.extend({
  components: {
    RandomButton,
  },
  props: {
    onHomePage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showMobileMenu: false,
      numberOfCombos: "thousands of",
    };
  },
  async fetch() {
    await this.lookupNumberOfCombos();
  },
  computed: {
    query: {
      get(): string {
        return this.$store.state.query.value;
      },
      set(value: string): void {
        this.$store.commit("query/change", value);
      },
    },
    inputClasses(): string {
      if (this.onHomePage) {
        return "text-2xl text-center";
      }
      return "pl-8 -ml-6";
    },
    isAuthenticated(): boolean {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },
  watch: {
    "$route.query.q"(): void {
      this.setQueryFromUrl();
    },
  },
  mounted() {
    this.setQueryFromUrl();
  },
  methods: {
    focusSearch(): void {
      (this.$refs.searchInput as HTMLInputElement).focus();
    },
    async lookupNumberOfCombos(): Promise<void> {
      const combos = await getAllCombos();

      this.numberOfCombos = String(combos.length);
    },
    setQueryFromUrl(): void {
      const query = this.$route.query.q;

      if (typeof query === "string") {
        this.query = query;
      } else {
        this.query = "";
      }
    },
    toggleMenu(): void {
      this.showMobileMenu = !this.showMobileMenu;
    },
    onSubmit(): void {
      if (!this.query.trim()) {
        return;
      }

      this.$gtag.event("search", {
        search_term: this.query,
      });

      this.$router.push({
        path: "/search/",
        query: {
          q: this.query,
        },
      });
    },
  },
});
</script>

<style scoped>
.outer-container {
  @apply mx-auto;
}

a {
  @apply text-white no-underline;
}

.main-search-input-container {
  @apply flex m-auto h-full;
}

.main-search-input {
  @apply w-full h-full appearance-none block py-2 bg-transparent text-white leading-tight;
}

.main-search-input:focus {
  @apply outline-none bg-white text-dark;
}

.link-icon {
  @apply bg-white h-4 w-4 mr-2;
}

.menu-icon {
  -webkit-mask: url("~assets/svgs/bars-solid.svg") no-repeat center;
  mask: url("~assets/svgs/bars-solid.svg") no-repeat center;
  @apply mr-0;
}

.advanced-search-icon {
  -webkit-mask: url("~assets/svgs/columns-solid.svg") no-repeat center;
  mask: url("~assets/svgs/columns-solid.svg") no-repeat center;
}

.syntax-guide-icon {
  -webkit-mask: url("~assets/svgs/question-solid.svg") no-repeat center;
  mask: url("~assets/svgs/question-solid.svg") no-repeat center;
}

.profile-icon {
  -webkit-mask: url("~assets/svgs/user-circle-solid.svg") no-repeat center;
  mask: url("~assets/svgs/user-circle-solid.svg") no-repeat center;
}

.random-icon {
  -webkit-mask: url("~assets/svgs/random-solid.svg") no-repeat center;
  mask: url("~assets/svgs/random-solid.svg") no-repeat center;
}

.search-input-icon {
  -webkit-mask: url("~assets/svgs/search-solid.svg") no-repeat center;
  mask: url("~assets/svgs/search-solid.svg") no-repeat center;
  @apply bg-light w-4 h-4 mt-1 z-10 cursor-pointer;
}

.search-input-icon:hover {
  @apply bg-light;
}

.menu-link {
  @apply items-center flex-row px-4 text-white border-l border-white;
}

.menu-link:last-of-type {
  @apply pr-0;
}

.menu-link:hover {
  @apply text-light;
}

.menu-link:hover .link-icon {
  @apply bg-light;
}

.mobile-menu-button {
  @apply flex flex-row flex-grow items-center w-1/3 rounded py-1 px-2 border border-light mx-2;
}

.mobile-menu-button:hover {
  @apply border-light text-light;
}

.mobile-menu-button:hover .link-icon {
  @apply bg-light;
}

.mobile-menu-button:nth-child(even),
.mobile-menu-button:last-of-type {
  @apply mr-0;
}
.mobile-menu-button:nth-child(odd) {
  @apply ml-0;
}

.mobile-menu-button:nth-child(n + 3) {
  @apply mt-2;
}

@media (min-width: 640px) {
  #search-bar-menu-button {
    @apply hidden;
  }
}
</style>
