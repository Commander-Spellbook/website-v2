import { shallowMount } from "@vue/test-utils";

import flushPromises from "flush-promises";
import ComboFinderPage from "@/pages/combo-finder.vue";
import makeFakeCombo from "~/lib/api/make-fake-combo";
import Card from "@/lib/api/models/card";
import { pluralize as $pluralize } from "@/plugins/text-helpers";
import {
  findCombosFromDecklist,
  convertDecklistToDeck,
} from "@/lib/decklist-parser";

import type { MountOptions, VueComponent } from "@/test/types";

jest.mock("@/lib/decklist-parser");

const LOCAL_STORAGE_DECK_STORAGE_KEY =
  "commander-spellbook-combo-finder-last-decklist";

describe("ComboFinderPage", () => {
  let options: MountOptions;

  beforeEach(() => {
    options = {
      stubs: {},
      mocks: {
        $pluralize,
      },
    };
  });

  afterEach(() => {
    localStorage.removeItem(LOCAL_STORAGE_DECK_STORAGE_KEY);
  });

  describe("saved decklist", () => {
    it("loads decklist saved in localstorage", async () => {
      localStorage.setItem(
        LOCAL_STORAGE_DECK_STORAGE_KEY,
        "Card Foo\nCard Bar"
      );

      const spy = jest
        .spyOn(
          (ComboFinderPage as VueComponent).options.methods,
          "lookupCombos"
        )
        .mockResolvedValue(null);

      const wrapper = shallowMount(ComboFinderPage, options);

      await flushPromises();

      expect(
        (wrapper.find("textarea").element as HTMLTextAreaElement).value
      ).toBe("Card Foo\nCard Bar");

      expect(spy).toBeCalledTimes(1);
    });

    it("does not load decklist saved in localstorage if it is empty space", async () => {
      localStorage.setItem(LOCAL_STORAGE_DECK_STORAGE_KEY, "     ");

      const wrapper = shallowMount(ComboFinderPage, options);

      await flushPromises();

      expect(
        (wrapper.find("textarea").element as HTMLTextAreaElement).value
      ).toBe("");
    });
  });

  describe("deck count element", () => {
    it("hides deck count when no decklist is available", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      expect(wrapper.find("#decklist-card-count").exists()).toBe(false);

      await wrapper.setData({
        decklist: "foo\nbar\nbaz",
      });

      expect(wrapper.find("#decklist-card-count").exists()).toBe(true);
    });

    it("shows deck count", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "data",
        numberOfCardsInDeck: 3,
      });

      expect(wrapper.find("#decklist-card-count").text()).toBe("3 cards");

      await wrapper.setData({
        numberOfCardsInDeck: 0,
      });

      expect(wrapper.find("#decklist-card-count").text()).toBe("0 cards");

      await wrapper.setData({
        numberOfCardsInDeck: 1,
      });

      expect(wrapper.find("#decklist-card-count").text()).toBe("1 card");
    });
  });

  describe("clear decklist button", () => {
    it("hides when no decklist is available", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      expect(wrapper.find("#clear-decklist-input").exists()).toBe(false);

      await wrapper.setData({
        decklist: "foo\nbar",
      });

      expect(wrapper.find("#clear-decklist-input").exists()).toBe(true);
    });

    it("clears decklist when clicked", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "foo\nbar",
      });

      await wrapper.find("#clear-decklist-input").trigger("click");

      expect(
        (wrapper.find("#decklist-input").element as HTMLTextAreaElement).value
      ).toBe("");
    });

    it("clears localStorage when clicked", async () => {
      // got to prevent it from attempting to lookup combos from value in localStorage
      jest
        .spyOn(
          (ComboFinderPage as VueComponent).options.methods,
          "lookupCombos"
        )
        .mockResolvedValue(null);

      localStorage.setItem(
        LOCAL_STORAGE_DECK_STORAGE_KEY,
        "Card Foo\nCard Bar"
      );

      const wrapper = shallowMount(ComboFinderPage, options);

      await flushPromises();

      await wrapper.find("#clear-decklist-input").trigger("click");

      expect(localStorage.getItem(LOCAL_STORAGE_DECK_STORAGE_KEY)).toBeFalsy();
    });
  });

  describe("hint box", () => {
    it("hides when decklist becomes available", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      expect(wrapper.find("#decklist-hint").exists()).toBe(true);

      await wrapper.setData({
        decklist: "foo\nbar",
      });

      expect(wrapper.find("#decklist-hint").exists()).toBe(false);
    });
  });

  describe("combos in deck section", () => {
    it("hides when no decklist is empty", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      expect(wrapper.find("#combos-in-deck-section").exists()).toBe(false);

      await wrapper.setData({
        decklist: "foo\nbar",
      });

      expect(wrapper.find("#combos-in-deck-section").exists()).toBe(true);
    });

    it("hides when lookup is in progress", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "foo\nbar",
        combosInDeck: [],
        lookupInProgress: true,
      });

      expect(wrapper.find("#combos-in-deck-section").exists()).toBe(false);
    });

    it("updates heading based on number of combos found", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "foo\nbar",
        combosInDeck: [],
      });

      expect(wrapper.find("#combos-in-deck-section h2").text()).toBe(
        "No Combos Found"
      );

      await wrapper.setData({
        combosInDeck: [makeFakeCombo()],
      });

      expect(wrapper.find("#combos-in-deck-section h2").text()).toBe(
        "1 Combo Found"
      );

      await wrapper.setData({
        combosInDeck: [makeFakeCombo(), makeFakeCombo()],
      });

      expect(wrapper.find("#combos-in-deck-section h2").text()).toBe(
        "2 Combos Found"
      );
    });

    it("populates combos", async () => {
      const ComboResults = { template: "<div></div>", props: ["results"] };
      // @ts-ignore
      options.stubs.ComboResults = ComboResults;
      const wrapper = shallowMount(ComboFinderPage, options);

      const combos = [makeFakeCombo(), makeFakeCombo(), makeFakeCombo()];
      await wrapper.setData({
        decklist: "foo",
        combosInDeck: combos,
      });

      const cr = wrapper
        .find("#combos-in-deck-section")
        .findComponent(ComboResults);

      expect(cr.props("results")).toBe(combos);
    });
  });

  describe("potential combos in deck section", () => {
    it("hides when there are no potential combos in deck", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      expect(wrapper.find("#potential-combos-in-deck-section").exists()).toBe(
        false
      );

      // still shouldn't show, because only combo is outside of color identity
      await wrapper.setData({
        potentialCombos: [makeFakeCombo({ colorIdentity: "b" })],
        deckColorIdentity: ["g", "r", "w"],
      });
      expect(wrapper.find("#potential-combos-in-deck-section").exists()).toBe(
        false
      );

      await wrapper.setData({
        potentialCombos: [makeFakeCombo({ colorIdentity: "g" })],
        deckColorIdentity: ["g", "r", "w"],
      });

      expect(wrapper.find("#potential-combos-in-deck-section").exists()).toBe(
        true
      );
    });

    it("hides when lookup is in progress", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "foo\nbar",
        combosInDeck: [],
        potentialCombos: [makeFakeCombo()],
        lookupInProgress: true,
      });

      expect(wrapper.find("#potential-combos-in-deck-section").exists()).toBe(
        false
      );
    });

    it("updates heading based on number of combos found that match deck color identity", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "foo\nbar",
        combosInDeck: [],
        potentialCombos: [],
      });

      expect(wrapper.find("#potential-combos-in-deck-section").exists()).toBe(
        false
      );

      await wrapper.setData({
        potentialCombos: [
          makeFakeCombo({ colorIdentity: "g" }),
          makeFakeCombo({ colorIdentity: "wb" }),
        ],
        deckColorIdentity: ["b", "g"],
      });

      expect(wrapper.find("#potential-combos-in-deck-section h2").text()).toBe(
        "1 Potential Combo Found"
      );

      await wrapper.setData({
        potentialCombos: [
          makeFakeCombo({ colorIdentity: "g" }),
          makeFakeCombo({ colorIdentity: "wb" }),
          makeFakeCombo({ colorIdentity: "gb" }),
        ],
      });

      expect(wrapper.find("#potential-combos-in-deck-section h2").text()).toBe(
        "2 Potential Combos Found"
      );
    });

    it("populates potential combos", async () => {
      const ComboResults = {
        template: "<div></div>",
        props: ["results", "missingDecklistCards"],
      };
      // @ts-ignore
      options.stubs.ComboResults = ComboResults;
      const wrapper = shallowMount(ComboFinderPage, options);

      const combos = [
        makeFakeCombo({
          colorIdentity: "g",
        }),
        makeFakeCombo({
          colorIdentity: "b",
        }),
        makeFakeCombo({
          colorIdentity: "w",
        }),
        makeFakeCombo({
          colorIdentity: "gb",
        }),
      ];
      const missingCards = [new Card("card a")];
      await wrapper.setData({
        decklist: "foo",
        potentialCombos: combos,
        missingDecklistCards: missingCards,
        deckColorIdentity: ["b", "g"],
      });

      const cr = wrapper
        .find("#potential-combos-in-deck-section")
        .findComponent(ComboResults);

      expect(cr.props("results")).toHaveLength(3);
      expect(cr.props("results")[0]).toBe(combos[0]);
      expect(cr.props("results")[1]).toBe(combos[1]);
      expect(cr.props("results")[2]).toBe(combos[3]);

      expect(cr.props("missingDecklistCards")).toBe(missingCards);
    });
  });

  describe("potential combos outside color identity section", () => {
    it("hides when there are no potential combos in deck", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      expect(
        wrapper
          .find("#potential-combos-outside-color-identity-section")
          .exists()
      ).toBe(false);

      await wrapper.setData({
        potentialCombos: [makeFakeCombo({ colorIdentity: "b" })],
        deckColorIdentity: ["g"],
      });

      expect(
        wrapper
          .find("#potential-combos-outside-color-identity-section")
          .exists()
      ).toBe(true);
    });

    it("hides when lookup is in progress", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "foo\nbar",
        combosInDeck: [],
        potentialCombos: [makeFakeCombo({ colorIdentity: "r" })],
        lookupInProgress: true,
        deckColorIdentity: ["w"],
      });

      expect(
        wrapper
          .find("#potential-combos-outside-color-identity-section")
          .exists()
      ).toBe(false);
    });

    it("updates heading based on number of combos found that match deck color identity", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "foo\nbar",
        combosInDeck: [],
        potentialCombos: [],
      });

      expect(
        wrapper
          .find("#potential-combos-outside-color-identity-section")
          .exists()
      ).toBe(false);

      await wrapper.setData({
        potentialCombos: [
          makeFakeCombo({ colorIdentity: "g" }),
          makeFakeCombo({ colorIdentity: "wb" }),
        ],
        deckColorIdentity: ["b", "g"],
      });

      expect(
        wrapper
          .find("#potential-combos-outside-color-identity-section h2")
          .text()
      ).toBe("1 Potential Combo Found With Additional Color Requirements");

      await wrapper.setData({
        potentialCombos: [
          makeFakeCombo({ colorIdentity: "g" }),
          makeFakeCombo({ colorIdentity: "wb" }),
          makeFakeCombo({ colorIdentity: "r" }),
        ],
      });

      expect(
        wrapper
          .find("#potential-combos-outside-color-identity-section h2")
          .text()
      ).toBe("2 Potential Combos Found With Additional Color Requirements");
    });

    it("populates potential combos with additional color requirements", async () => {
      const ComboResults = {
        template: "<div></div>",
        props: ["results", "missingDecklistCards"],
      };
      // @ts-ignore
      options.stubs.ComboResults = ComboResults;
      const wrapper = shallowMount(ComboFinderPage, options);

      const combos = [
        makeFakeCombo({
          colorIdentity: "wg",
        }),
        makeFakeCombo({
          colorIdentity: "rb",
        }),
        makeFakeCombo({
          colorIdentity: "b",
        }),
        makeFakeCombo({
          colorIdentity: "r",
        }),
      ];
      const missingCards = [new Card("card a")];
      await wrapper.setData({
        decklist: "foo",
        potentialCombos: combos,
        missingDecklistCards: missingCards,
        deckColorIdentity: ["b", "g"],
      });

      const cr = wrapper
        .find("#potential-combos-outside-color-identity-section")
        .findComponent(ComboResults);

      expect(cr.props("results")).toHaveLength(3);
      expect(cr.props("results")[0]).toBe(combos[0]);
      expect(cr.props("results")[1]).toBe(combos[1]);
      expect(cr.props("results")[2]).toBe(combos[3]);

      expect(cr.props("missingDecklistCards")).toBe(missingCards);
    });

    it("only displays combos that match color identity selected outside of deck color identity", async () => {
      const ComboResults = {
        template: "<div></div>",
        props: ["results", "missingDecklistCards"],
      };
      // @ts-ignore
      options.stubs.ComboResults = ComboResults;
      const wrapper = shallowMount(ComboFinderPage, options);

      const combos = [
        makeFakeCombo({
          colorIdentity: "wub",
        }),
        makeFakeCombo({
          colorIdentity: "w",
        }),
        makeFakeCombo({
          colorIdentity: "r",
        }),
        makeFakeCombo({
          colorIdentity: "rg",
        }),
      ];
      const missingCards = [new Card("card a")];
      await wrapper.setData({
        decklist: "foo",
        potentialCombos: combos,
        missingDecklistCards: missingCards,
        potentialCombosColorIdentity: ["w"],
        deckColorIdentity: ["r"],
      });

      const cr = wrapper
        .find("#potential-combos-outside-color-identity-section")
        .findComponent(ComboResults);

      expect(cr.props("results")).toHaveLength(1);
      expect(cr.props("results")[0]).toBe(combos[1]);
    });
  });

  describe("lookupCombos", () => {
    it("does not lookup combos when decklist only contains one card", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "Card 1",
      });

      jest.mocked(convertDecklistToDeck).mockResolvedValue({
        cards: ["Card 1"],
        numberOfCards: 1,
        colorIdentity: [],
      });

      await (wrapper.vm as VueComponent).lookupCombos();

      expect(convertDecklistToDeck).toBeCalledTimes(1);
      expect(convertDecklistToDeck).toBeCalledWith("Card 1");

      expect(findCombosFromDecklist).not.toBeCalled();
    });

    it("resets combos in deck and potential combos", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "Card 1",
        combosInDeck: [makeFakeCombo(), makeFakeCombo()],
        potentialCombos: [makeFakeCombo(), makeFakeCombo()],
      });

      jest.mocked(convertDecklistToDeck).mockResolvedValue({
        cards: ["Card 1"],
        numberOfCards: 1,
        colorIdentity: [],
      });

      const vm = wrapper.vm as VueComponent;

      await vm.lookupCombos();

      expect(vm.combosInDeck).toEqual([]);
      expect(vm.potentialCombos).toEqual([]);
    });

    it("looks up and populates combos", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "Card 1\nCard 2",
        combosInDeck: [],
        potentialCombos: [],
      });

      jest.mocked(convertDecklistToDeck).mockResolvedValue({
        cards: ["Card 1", "Card 2"],
        numberOfCards: 2,
        colorIdentity: [],
      });

      const combosInDecklist = [makeFakeCombo(), makeFakeCombo()];
      const potentialCombos = [makeFakeCombo(), makeFakeCombo()];

      jest.mocked(findCombosFromDecklist).mockResolvedValue({
        combosInDecklist,
        potentialCombos,
        missingCardsForPotentialCombos: [],
      });

      const vm = wrapper.vm as VueComponent;

      await vm.lookupCombos();

      expect(findCombosFromDecklist).toBeCalledTimes(1);
      expect(findCombosFromDecklist).toBeCalledWith(["Card 1", "Card 2"]);

      expect(vm.combosInDeck).toBe(combosInDecklist);
      expect(vm.potentialCombos).toBe(potentialCombos);
    });

    it("sets deck color identity based on color identity of deck", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "Card 1\nCard 2",
        combosInDeck: [],
        potentialCombos: [],
      });

      jest.mocked(convertDecklistToDeck).mockResolvedValue({
        cards: ["Card 1", "Card 2"],
        numberOfCards: 2,
        colorIdentity: ["w", "b"],
      });

      const combosInDecklist = [makeFakeCombo(), makeFakeCombo()];
      const potentialCombos = [makeFakeCombo(), makeFakeCombo()];

      jest.mocked(findCombosFromDecklist).mockResolvedValue({
        combosInDecklist,
        potentialCombos,
        missingCardsForPotentialCombos: [],
      });

      const vm = wrapper.vm as VueComponent;

      await vm.lookupCombos();

      expect(vm.deckColorIdentity).toEqual(["w", "b"]);
    });

    it("resets potential color identity picker", async () => {
      const wrapper = shallowMount(ComboFinderPage, options);

      await wrapper.setData({
        decklist: "Card 1\nCard 2",
        combosInDeck: [],
        potentialCombos: [],
        potentialCombosColorIdentity: ["w"],
      });

      jest.mocked(convertDecklistToDeck).mockResolvedValue({
        cards: ["Card 1", "Card 2"],
        numberOfCards: 2,
        colorIdentity: ["w", "b"],
      });

      const combosInDecklist = [makeFakeCombo(), makeFakeCombo()];
      const potentialCombos = [makeFakeCombo(), makeFakeCombo()];

      jest.mocked(findCombosFromDecklist).mockResolvedValue({
        combosInDecklist,
        potentialCombos,
        missingCardsForPotentialCombos: [],
      });

      const vm = wrapper.vm as VueComponent;

      await vm.lookupCombos();

      expect(vm.potentialCombosColorIdentity).toEqual([
        "w",
        "u",
        "b",
        "r",
        "g",
      ]);
    });
  });
});
