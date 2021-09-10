<template>
  <div class="container relative md:h-screen z-10">
    <div class="w-full">
      <Logo />

      <h2 class="font-title my-1 sm:my-3 text-2xl sm:text-3xl md:text-4xl">
        The Search Engine for EDH Combos
      </h2>

      <SearchBar :on-home-page="true" class="bg-white mt-4 md:w-2/3 h-20" />

      <div class="button-links md:flex-row md:w-2/3 m-auto flex flex-col">
        <nuxt-link to="/advanced-search/" class="dark button md:m-1">
          Advanced Search
        </nuxt-link>
        <nuxt-link to="/syntax-guide/" class="dark button md:m-1">
          Syntax Guide
        </nuxt-link>
        <RandomButton :query="query" class="random-button dark button md:m-1">
          Random Combo
        </RandomButton>
        <nuxt-link
          to="/featured/"
          class="previwed-combos-button dark button md:m-1"
        >
          Midnight Hunt Combos
        </nuxt-link>
      </div>

      <div class="button-links flex md:w-2/3 m-auto">
        <ExternalLink
          class="dark button"
          to="https://www.patreon.com/commanderspellbook"
          >Join our Patreon</ExternalLink
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RandomButton from "@/components/RandomButton.vue";
import SearchBar from "@/components/SearchBar.vue";
import ExternalLink from "@/components/ExternalLink.vue";
import Logo from "@/components/Logo.vue";

export default Vue.extend({
  components: {
    ExternalLink,
    RandomButton,
    SearchBar,
    Logo,
  },
  layout: "landing",
  computed: {
    query(): string {
      return this.$store.state.query.value;
    },
  },
  mounted() {
    const query = this.$route.query.q;
    const { status, id } = this.$route.query;

    if (Number(query) > 0 || Number(id) > 0) {
      this.$router.push(`/combo/${id || query}/`);
      return;
    }

    if (query === "spoiled" || status === "spoiled") {
      this.$router.push("/search/?q=is:previewed");
      return;
    }

    if (query === "banned" || status === "banned") {
      this.$router.push("/search/?q=is:banned");
      return;
    }

    if (!(typeof query === "string")) {
      return;
    }

    this.$router.push(`/search/?q=${query}`);
  },
});
</script>

<style scoped>
.container {
  @apply flex flex-col items-center justify-center text-center m-auto;
}

.button {
  @apply mx-0 mt-2 mb-0 flex-grow;
}

.button:hover {
  @apply bg-transparent text-dark;
}

@media (min-width: 768px) {
  .button {
    @apply ml-2;
  }

  .button:first-child {
    @apply ml-0;
  }
}
</style>
