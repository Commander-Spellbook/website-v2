import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import SearchBar from "@/components/SearchBar.vue";
import makeFakeCombo from "@/lib/api/make-fake-combo";
import getAllCombos from "@/lib/api/get-all-combos";
import { mocked } from "ts-jest/utils";
import { createStore } from "../utils";
import type {
  MountOptions,
  Route,
  Router,
  Store,
  VueComponent,
} from "../types";

jest.mock("@/lib/api/get-all-combos");

describe("SearchBar", () => {
  let wrapperOptions: MountOptions;
  let $route: Route;
  let $router: Router;
  let $store: Store;

  beforeEach(() => {
    $route = {
      path: "",
      query: {},
    };
    $store = createStore({
      getters: {
        "auth/isAuthenticated": false,
      },
    });
    $router = {
      push: jest.fn(),
    };
    wrapperOptions = {
      stubs: {
        NuxtLink: true,
      },
      mocks: {
        $route,
        $router,
        $store,
        $gtag: {
          event: jest.fn(),
        },
      },
    };
  });

  it("sets query from the query param when mounting", () => {
    $route.query.q = "card:sydri";
    // @ts-ignore
    jest.spyOn(SearchBar.options.methods, "setQueryFromUrl");
    mount(SearchBar, wrapperOptions);

    // @ts-ignore
    expect(SearchBar.options.methods.setQueryFromUrl).toBeCalledTimes(1);
  });

  it("it triggers onSubmit when enter key is pressed", async () => {
    const wrapper = mount(SearchBar, wrapperOptions);
    const vm = wrapper.vm as VueComponent;

    jest.spyOn(vm, "onSubmit");

    await wrapper.find("form").trigger("submit");

    expect(vm.onSubmit).toBeCalledTimes(1);
  });

  it("does not display navigation links when on home page", async () => {
    const NuxtLinkStub = {
      props: ["to"],
      template: "<div></div>",
    };
    const RandomButtonStub = {
      props: ["query"],
      template: "<div><slot /></div>",
    };
    // @ts-ignore
    wrapperOptions.stubs.NuxtLink = NuxtLinkStub;
    // @ts-ignore
    wrapperOptions.stubs.RandomButton = RandomButtonStub;
    const wrapper = mount(SearchBar, wrapperOptions);

    const links = wrapper.findAllComponents(NuxtLinkStub);

    expect(links.at(0).props("to")).toBe("/");
    expect(links.at(1).props("to")).toBe("/advanced-search/");
    expect(links.at(2).props("to")).toBe("/syntax-guide/");
    expect(wrapper.findComponent(RandomButtonStub)).toBeTruthy();

    await wrapper.setProps({
      onHomePage: true,
    });

    expect(wrapper.findComponent(NuxtLinkStub).exists()).toBe(false);
    expect(wrapper.findComponent(RandomButtonStub).exists()).toBe(false);
  });

  it("includes the autofocus attribute on home page", async () => {
    const wrapper = mount(SearchBar, wrapperOptions);

    expect(
      wrapper.find("#search-bar-input").attributes("autofocus")
    ).toBeFalsy();

    await wrapper.setProps({
      onHomePage: true,
    });

    expect(
      wrapper.find("#search-bar-input").attributes("autofocus")
    ).toBeTruthy();
  });

  it("applies q query if applicable to random button", async () => {
    const RandomButtonStub = {
      props: ["query"],
      template: "<div><slot /></div>",
    };
    // @ts-ignore
    wrapperOptions.stubs.RandomButton = RandomButtonStub;
    const wrapper = mount(SearchBar, wrapperOptions);
    const randomButton = wrapper.findComponent(RandomButtonStub);

    expect(randomButton.props("query")).toEqual("");

    $store.state.query.value = "search";

    await flushPromises();

    expect(randomButton.props("query")).toEqual("search");
  });

  it("displays profile link when logged in", async () => {
    const NuxtLinkStub = {
      props: ["to"],
      template: "<div></div>",
    };
    // @ts-ignore
    wrapperOptions.stubs.NuxtLink = NuxtLinkStub;
    const wrapper = mount(SearchBar, wrapperOptions);

    expect(
      wrapper
        .findComponent({
          ref: "profile-link",
        })
        .isVisible()
    ).toBe(false);

    $store.getters["auth/isAuthenticated"] = true;

    await flushPromises();

    expect(
      wrapper
        .findComponent({
          ref: "profile-link",
        })
        .isVisible()
    ).toBe(true);

    // also check the mobile menu
    $store.getters["auth/isAuthenticated"] = false;

    await flushPromises();

    await wrapper.find("#search-bar-menu-button").trigger("click");
    expect(
      wrapper
        .findComponent({
          ref: "mobile-profile-link",
        })
        .isVisible()
    ).toBe(false);

    $store.getters["auth/isAuthenticated"] = true;

    await flushPromises();

    expect(
      wrapper
        .findComponent({
          ref: "mobile-profile-link",
        })
        .isVisible()
    ).toBe(true);
  });

  it("toggles link menu when menu button is clicked", async () => {
    const wrapper = mount(SearchBar, wrapperOptions);
    const vm = wrapper.vm as VueComponent;

    expect(vm.showMobileMenu).toBe(false);

    await wrapper.find("#search-bar-menu-button").trigger("click");

    expect(vm.showMobileMenu).toBe(true);
  });

  describe("lookupNumberOfCombos", () => {
    it("sets numberOfCombos to the number of combos found in spellbook api", async () => {
      const wrapper = mount(SearchBar, wrapperOptions);
      const vm = wrapper.vm as VueComponent;
      const mockCombo = makeFakeCombo();

      mocked(getAllCombos).mockResolvedValue([mockCombo]);

      expect(
        wrapper.find(".main-search-input").element.getAttribute("placeholder")
      ).toBe("Search thousands of EDH combos");

      await vm.lookupNumberOfCombos();

      expect(
        wrapper.find(".main-search-input").element.getAttribute("placeholder")
      ).toBe("Search 1 EDH combos");
    });
  });

  describe("onSubmit", () => {
    it("noops when there is no query", () => {
      const wrapper = mount(SearchBar, wrapperOptions);
      const vm = wrapper.vm as VueComponent;

      vm.onSubmit();

      expect($router.push).not.toBeCalled();
    });

    it("noops when the query is made up of blank spaces", () => {
      const wrapper = mount(SearchBar, wrapperOptions);
      const vm = wrapper.vm as VueComponent;

      $store.state.query.value = "      ";

      vm.onSubmit();

      expect($router.push).not.toBeCalled();
    });

    it("redirects to /search with query", () => {
      const wrapper = mount(SearchBar, wrapperOptions);
      const vm = wrapper.vm as VueComponent;

      $store.state.query.value = "card:Rashmi";

      vm.onSubmit();

      expect($router.push).toBeCalledTimes(1);
      expect($router.push).toBeCalledWith({
        path: "/search/",
        query: {
          q: "card:Rashmi",
        },
      });
    });

    it("sends an analytics event", () => {
      // @ts-ignore
      const eventSpy = wrapperOptions.mocks.$gtag.event;
      const wrapper = mount(SearchBar, wrapperOptions);
      const vm = wrapper.vm as VueComponent;

      $store.state.query.value = "card:Rashmi";

      vm.onSubmit();

      expect(eventSpy).toBeCalledTimes(1);
      expect(eventSpy).toBeCalledWith("search", {
        search_term: "card:Rashmi",
      });
    });
  });

  describe("setQueryFromUrl", () => {
    it("updates query to empty string when there is no query in url", () => {
      const wrapper = mount(SearchBar, wrapperOptions);
      const vm = wrapper.vm as VueComponent;

      $store.commit.mockReset();

      vm.setQueryFromUrl();

      expect($store.commit).toBeCalledTimes(1);
      expect($store.commit).toBeCalledWith("query/change", "");
    });

    it("updates query to empty string when the query in the url is not a string", () => {
      const wrapper = mount(SearchBar, wrapperOptions);
      const vm = wrapper.vm as VueComponent;

      // @ts-ignore
      $route.query.q = ["card:sydri"];

      $store.commit.mockReset();

      vm.setQueryFromUrl();

      expect($store.commit).toBeCalledTimes(1);
      expect($store.commit).toBeCalledWith("query/change", "");
    });

    it("updates query to query string when the query in the url is a string", () => {
      const wrapper = mount(SearchBar, wrapperOptions);
      const vm = wrapper.vm as VueComponent;

      $route.query.q = "some-query";

      $store.commit.mockReset();

      vm.setQueryFromUrl();

      expect($store.commit).toBeCalledTimes(1);
      expect($store.commit).toBeCalledWith("query/change", "some-query");
    });
  });

  describe("toggleMenu", () => {
    it("toggles showMobileMenu state", () => {
      const wrapper = mount(SearchBar, wrapperOptions);
      const vm = wrapper.vm as VueComponent;

      wrapper.setData({
        showMobileMenu: false,
      });

      vm.toggleMenu();

      expect(vm.showMobileMenu).toBe(true);

      vm.toggleMenu();

      expect(vm.showMobileMenu).toBe(false);
    });
  });
});
