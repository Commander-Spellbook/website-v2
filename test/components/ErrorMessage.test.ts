import { mount } from "@vue/test-utils";
import ErrorMessage from "@/components/ErrorMessage.vue";

describe("ErrorMessage", () => {
  it("can be configured with an error message", () => {
    const wrapper = mount(ErrorMessage, {
      propsData: {
        message: "message",
      },
    });

    expect(wrapper.find(".error-message").text()).toContain("message");
  });
});
