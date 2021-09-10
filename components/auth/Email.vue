<template>
  <div class="max-w-full md:w-72">
    <div v-if="!linkSent">
      <div class="mb-2 text-center">
        <p class="prompt-text">{{ promptText }}</p>
      </div>

      <form @submit.prevent="requestMagicLink">
        <div>
          <label class="sr-only" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            class="input"
            :class="{ 'border border-red-400': error }"
            type="text"
            placeholder="email address"
            @input="error = ''"
          />
          <ErrorMessage :message="error" />
        </div>

        <button type="submit" class="button w-full">
          {{ submitButtonText }}
        </button>
      </form>

      <slot />
    </div>

    <div v-else>{{ linkSentText }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default Vue.extend({
  components: {
    ErrorMessage,
  },
  layout: "splash",
  props: {
    promptText: {
      type: String,
      default: "",
    },
    submitButtonText: {
      type: String,
      default: "",
    },
    linkSentText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      error: "",
      email: "",
      linkSent: false,
    };
  },
  methods: {
    requestMagicLink() {
      this.error = "";

      return this.$store
        .dispatch("auth/requestMagicLink", {
          email: this.email,
        })
        .then(() => {
          this.linkSent = true;
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
  },
});
</script>
