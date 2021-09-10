import type { mount } from "@vue/test-utils";
import type { QueryState } from "../store/query";

export type MountOptions = Parameters<typeof mount>[1];
export type Route = {
  params?: Record<string, string>;
  path?: string;
  query: Record<string, string>;
};
export type Router = {
  push: jest.SpyInstance;
  replace?: jest.SpyInstance;
};
export type Store = {
  state: {
    query: QueryState;
  };
  getters: Record<string, any>;
  commit: jest.SpyInstance;
  dispatch: jest.SpyInstance;
};
export type Firebase = {
  auth: {
    currentUser: {
      email?: string;
      displayName?: string;
    };
  };
};
export type VueComponent = Record<string, any>;
