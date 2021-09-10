import { shallowMount } from "@vue/test-utils";
import Email from "@/components/auth/Email.vue";
import { createStore } from "../../utils";

import type { Store, VueComponent } from "../../types";

describe("Email Auth", () => {
  let $store: Store;

  beforeEach(() => {
    $store = createStore();
  });

  it("calls requestMagicLink when form submits", () => {
    const wrapper = shallowMount(Email, {
      mocks: {
        $store,
      },
      stubs: {
        ErrorMessage: true,
      },
      propsData: {
        submitButtonText: "submit",
      },
    });

    const spy = jest.spyOn(wrapper.vm as VueComponent, "requestMagicLink");

    wrapper.find("form").trigger("submit");

    expect(spy).toBeCalledTimes(1);
  });

  it("configures informational text in form", () => {
    const wrapper = shallowMount(Email, {
      mocks: {
        $store,
      },
      stubs: {
        ErrorMessage: true,
      },
      propsData: {
        promptText: "prompt text",
        submitButtonText: "submit text",
      },
    });

    expect(wrapper.find(".prompt-text").text()).toContain("prompt text");
    expect(wrapper.find("button").text()).toContain("submit text");
  });

  it("shows error message when an error is present", async () => {
    const ErrorMessageStub = {
      props: ["message"],
      template: "<div></div>",
    };
    const wrapper = shallowMount(Email, {
      mocks: {
        $store,
      },
      stubs: {
        ErrorMessage: ErrorMessageStub,
      },
    });

    await wrapper.setData({
      error: "error message",
    });

    expect(wrapper.findComponent(ErrorMessageStub).props("message")).toBe(
      "error message"
    );
  });

  describe("requestMagicLink", () => {
    it("dispatches auth/requestMagicLink action", async () => {
      const wrapper = shallowMount(Email, {
        mocks: {
          $store,
        },
        stubs: {
          ErrorMessage: true,
        },
      });
      const vm = wrapper.vm as VueComponent;

      await wrapper.setData({
        email: "arjun@example.com",
      });

      await vm.requestMagicLink();

      expect($store.dispatch).toBeCalledTimes(1);
      expect($store.dispatch).toBeCalledWith("auth/requestMagicLink", {
        email: "arjun@example.com",
      });
    });

    it("removes error message if it already exists", async () => {
      const wrapper = shallowMount(Email, {
        mocks: {
          $store,
        },
        stubs: {
          ErrorMessage: true,
        },
      });
      const vm = wrapper.vm as VueComponent;

      await wrapper.setData({
        error: "error message",
      });

      await vm.requestMagicLink();

      expect(vm.error).toBe("");
    });

    it("sets component to completed state when dispatch is sent", async () => {
      const wrapper = shallowMount(Email, {
        mocks: {
          $store,
        },
        stubs: {
          ErrorMessage: true,
        },
        propsData: {
          linkSentText: "link sent text",
        },
      });
      const vm = wrapper.vm as VueComponent;

      await vm.requestMagicLink();

      expect(wrapper.find("form").exists()).toBeFalsy();
      expect(wrapper.find("div").text()).toContain("link sent text");
    });

    it("sets error message when log in fails", async () => {
      const wrapper = shallowMount(Email, {
        mocks: {
          $store,
        },
        stubs: {
          ErrorMessage: true,
        },
      });
      const vm = wrapper.vm as VueComponent;

      $store.dispatch.mockRejectedValue(new Error("some validation error"));

      await vm.requestMagicLink();

      expect(vm.error).toBe("some validation error");
    });
  });
});
