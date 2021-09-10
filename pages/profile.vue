<template>
  <div class="static-page">
    <ArtCircle
      card-name="Codie, Vociferous Codex"
      artist="Daniel Ljunggren"
      class="m-auto md:block hidden"
    />
    <h1 class="heading-title">Profile</h1>
    <p class="text-center">
      <nuxt-link to="/signout/">Sign Out</nuxt-link>
    </p>

    <p id="email"><strong class="font-bold">Email:</strong> {{ email }}</p>
    <p id="display-name">
      <strong class="font-bold">Display Name:</strong> TODO
    </p>

    <p>TODO: change display name</p>
    <p>TODO: change email</p>
    <p>TODO: points</p>
    <p>TODO: list of combos with their statuses</p>
    <p>TODO: filter combos by status</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ArtCircle from "@/components/ArtCircle.vue";

export default Vue.extend({
  components: {
    ArtCircle,
  },
  data() {
    return {
      email: "",
    };
  },
  mounted() {
    const user = this.$fire.auth.currentUser;

    if (!user) {
      return;
    }

    this.email = user.email || "";
  },
});
</script>

<style scoped>
/* TODO */
</style>
