import { createRoute, createStore } from "../utils";
import authMiddleware from "~/middleware/authenticated";

describe("authMiddleware", () => {
  it("noops if route does not need auth handling", () => {
    const store = createStore();
    const route = createRoute();
    const redirect = jest.fn();

    // @ts-ignore
    authMiddleware({
      store,
      route,
      redirect,
    });

    expect(redirect).not.toBeCalled();
  });

  it("signs the user out when the signout route is used", async () => {
    const store = createStore();
    const route = createRoute({
      path: "/signout/",
    });
    const redirect = jest.fn();

    // @ts-ignore
    await authMiddleware({
      store,
      route,
      redirect,
    });

    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith("auth/signOut");
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith("/");
  });

  it("signs in with magic link when finish-login route is used", async () => {
    const store = createStore();
    const route = createRoute({
      path: "/finish-login/",
    });
    const redirect = jest.fn();

    // @ts-ignore
    await authMiddleware({
      store,
      route,
      redirect,
    });

    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith("auth/signInWithMagicLink");
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith("/profile/");
  });

  it.each(["/profile/"])(
    "noops if %s route requires authentication and user is authenticated",
    (path) => {
      const store = createStore({
        getters: {
          "auth/isAuthenticated": true,
        },
      });
      const route = createRoute({
        path,
      });
      const redirect = jest.fn();

      // @ts-ignore
      authMiddleware({
        store,
        route,
        redirect,
      });

      expect(redirect).not.toBeCalled();
    }
  );

  it.each(["/profile/"])(
    "reidrects if %s route requires authentication and user is not authenticated",
    (path) => {
      const store = createStore({
        getters: {
          "auth/isAuthenticated": false,
        },
      });
      const route = createRoute({
        path,
      });
      const redirect = jest.fn();

      // @ts-ignore
      authMiddleware({
        store,
        route,
        redirect,
      });

      expect(redirect).toBeCalledTimes(1);
      expect(redirect).toBeCalledWith("/login/");
    }
  );

  it.each(["/login/", "/sign-up"])(
    "noops if %s route should be skipped if logged in, but user is not authenticated",
    (path) => {
      const store = createStore({
        getters: {
          "auth/isAuthenticated": false,
        },
      });
      const route = createRoute({
        path,
      });
      const redirect = jest.fn();

      // @ts-ignore
      authMiddleware({
        store,
        route,
        redirect,
      });

      expect(redirect).not.toBeCalled();
    }
  );

  it.each(["/login/", "/sign-up"])(
    "reidrects if %s route should be skipped when user is logged in",
    (path) => {
      const store = createStore({
        getters: {
          "auth/isAuthenticated": true,
        },
      });
      const route = createRoute({
        path,
      });
      const redirect = jest.fn();

      // @ts-ignore
      authMiddleware({
        store,
        route,
        redirect,
      });

      expect(redirect).toBeCalledTimes(1);
      expect(redirect).toBeCalledWith("/profile/");
    }
  );
});
