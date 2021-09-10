import { state, mutations } from "~/store/query";

describe("Query Store", () => {
  describe("mutations", () => {
    describe("change", () => {
      it("sets query value", () => {
        const s = state();

        mutations.change(s, "new-query");

        expect(s.value).toBe("new-query");
      });
    });
  });
});
