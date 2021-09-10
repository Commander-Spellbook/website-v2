<template>
  <div>
    <a ref="skipLink" href="#main" class="sr-only">Skip to main content</a>
    <AnalyticsCookieBanner />
    <div class="bg-dark fixed top-0 left-0 right-0">
      <nav class="container">
        <SearchBar />
      </nav>
    </div>
    <main
      id="main"
      tabindex="-1"
      class="
        gradient
        h-screen
        pt-16
        md:pt-0 md:flex
        flex-col
        content-center
        justify-center
      "
    >
      <div
        class="w-min bg-white p-4 rounded shadow-xl w-auto mx-4 md:mx-auto my-4"
      >
        <div class="-mt-12 pt-2 mx-auto bg-white rounded-full h-24 w-24">
          <img
            src="~/assets/images/logo.svg"
            class="w-2/3 mx-auto"
            alt="Commander Spellbook Logo"
            aria-hidden="true"
          />
        </div>
        <Nuxt />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AnalyticsCookieBanner from "@/components/AnalyticsCookieBanner.vue";
import SearchBar from "@/components/SearchBar.vue";

export default Vue.extend({
  components: {
    AnalyticsCookieBanner,
    SearchBar,
  },
  watch: {
    $route(): void {
      (this.$refs.skipLink as HTMLAnchorElement).focus();
    },
  },
});
</script>
