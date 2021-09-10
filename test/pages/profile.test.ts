import { shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import ProfilePage from "@/pages/profile.vue";
import { createFirebase } from "../utils";

import type { Firebase } from "../types";

describe("ProfilePage", () => {
  let $fire: Firebase;

  beforeEach(() => {
    $fire = createFirebase();
  });

  it("sets user details to current user", async () => {
    $fire.auth.currentUser.email = "codie@example.com";

    const wrapper = shallowMount(ProfilePage, {
      mocks: {
        $fire,
      },
      stubs: {
        NuxtLink: true,
        ArtCircle: true,
      },
    });

    await flushPromises();

    expect(wrapper.find("#email").text()).toContain("codie@example.com");
  });
});
