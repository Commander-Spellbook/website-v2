import fireauth from "~/plugins/fireauth";

describe("fireauth", () => {
  it("commits user on auth change", async () => {
    const user = {
      email: "rashmi@example.com",
      displayName: "Rashmi, Eternities Crafter",
      isVerified: true,
      refreshToken: "token",
    };
    const commit = jest.fn();
    const onAuthStateChanged = jest.fn().mockImplementation((cb) => {
      cb(user);
    });

    await fireauth(
      {
        // @ts-ignore
        store: {
          commit,
        },
        $fire: {
          // @ts-ignore
          auth: {
            onAuthStateChanged,
          },
        },
      },
      null
    );

    expect(commit).toBeCalledWith("auth/setUser", user);
  });
});
