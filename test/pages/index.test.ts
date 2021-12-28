import { shallowMount } from "@vue/test-utils";

import { createStore } from "../utils";
import type { MountOptions, Route, Router, Store } from "../types";
import HomePage from "@/pages/index.vue";

describe("HomePage", () => {
  let $route: Route;
  let $router: Router;
  let $store: Store;
  let wrapperOptions: MountOptions;

  beforeEach(() => {
    $route = {
      query: {},
    };
    $router = {
      push: jest.fn(),
    };
    $store = createStore();
    wrapperOptions = {
      mocks: {
        $route,
        $router,
        $store,
      },
      stubs: {
        SearchBar: true,
        SpellbookLogo: true,
        NuxtLink: true,
      },
    };
  });

  it("remains on home page when no query is available", () => {
    shallowMount(HomePage, wrapperOptions);

    expect($router.push).not.toBeCalled();
  });

  it("remains on home page when query is not a string", () => {
    // @ts-ignore
    $route.query.q = ["foo", "bar"];
    shallowMount(HomePage, wrapperOptions);

    expect($router.push).not.toBeCalled();
  });

  it("redirects to search page when query is available", () => {
    $route.query.q = "card:Sydri";
    shallowMount(HomePage, wrapperOptions);

    expect($router.push).toBeCalledTimes(1);
    expect($router.push).toBeCalledWith("/search/?q=card:Sydri");
  });

  it("redirects to combo page when q query is a number", () => {
    $route.query.q = "435";
    shallowMount(HomePage, wrapperOptions);

    expect($router.push).toBeCalledTimes(1);
    expect($router.push).toBeCalledWith("/combo/435/");
  });

  it("redirects to combo page when id query is a number", () => {
    $route.query.id = "435";
    shallowMount(HomePage, wrapperOptions);

    expect($router.push).toBeCalledTimes(1);
    expect($router.push).toBeCalledWith("/combo/435/");
  });

  it("redirects to search results page when query is a previewed", () => {
    $route.query.q = "spoiled";
    shallowMount(HomePage, wrapperOptions);

    expect($router.push).toBeCalledTimes(1);
    expect($router.push).toBeCalledWith("/search/?q=is:previewed");
  });

  it("redirects to search results page when status param is spoiled", () => {
    $route.query.q = "card:Sydri";
    $route.query.status = "spoiled";
    shallowMount(HomePage, wrapperOptions);

    expect($router.push).toBeCalledTimes(1);
    expect($router.push).toBeCalledWith("/search/?q=is:previewed");
  });

  it("redirects to search results page when query is a banned", () => {
    $route.query.q = "banned";
    shallowMount(HomePage, wrapperOptions);

    expect($router.push).toBeCalledTimes(1);
    expect($router.push).toBeCalledWith("/search/?q=is:banned");
  });

  it("redirects to search results page when status param is a banned", () => {
    $route.query.q = "card:Sydri";
    $route.query.status = "banned";
    shallowMount(HomePage, wrapperOptions);

    expect($router.push).toBeCalledTimes(1);
    expect($router.push).toBeCalledWith("/search/?q=is:banned");
  });
});
