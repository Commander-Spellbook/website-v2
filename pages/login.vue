<template>
  <EmailAuth
    prompt-text="Enter your email address to log in"
    submit-button-text="Continue"
    link-sent-text="Check your email on this device for a sign in link."
  >
    <hr class="my-2" />

    <nuxt-link class="button dark w-full text-center" to="/sign-up/"
      >Create an Account</nuxt-link
    >
  </EmailAuth>
</template>

<script lang="ts">
import Vue from "vue";
import EmailAuth from "@/components/auth/Email.vue";

export default Vue.extend({
  components: {
    EmailAuth,
  },
  layout: "splash",
});
</script>
