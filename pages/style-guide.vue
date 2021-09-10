<template>
  <div class="static-page">
    <ArtCircle
      card-name="Stet, Draconic Proofreader"
      artist="Dmitry Burmak"
      class="m-auto md:block hidden"
    />
    <h1 class="heading-title">The Official™ Commander Spellbook Style Guide</h1>
    <h2 class="heading-subtitle text-center mt-0">
      By The Commander Spellbook Mod Team
    </h2>
    <h2 class="heading-subtitle text-center mt-0">
      (Don't ask why I decided to format this vaguely like a lab report. I felt
      like it, okay?)
    </h2>

    <p class="pt-12">
      If you have any questions, comments, or concerns about this document, ask
      one of the mods on the
      <ExternalLink to="https://discord.com/invite/F2kkt7pETB"
        >Commander Spellbook Discord server</ExternalLink
      >.
    </p>

    <p>
      This document should be considered a constant work-in-progress, and while
      things that are in the document should be considered accurate, they can be
      changed at any time as our policies change.
    </p>

    <p>
      If there is something you feel should be covered by the document that
      isn't, please let us know so that we at the spellbook can implement
      whatever needs to be implemented.
    </p>

    <hr />

    <h3 class="heading-subtitle">General Formatting Rules</h3>

    <h4 id="card-names">Card Names</h4>
    <ul>
      <li>
        All card names are written out in full. No abbreviations, nicknames,
        etc.

        <ul>
          <li>
            The exception to this rule is legendary card names. If there is a
            version of the card that shortens the name and there are no more
            recent printings of said card that does not shorten the name (not
            including oddities like weirdly worded Secret Lairs or stuff like
            the List that does not update wording), you may abbreviate the card
            name.
          </li>
          <li>
            This is not the case when there are two cards that would be
            abbreviated the same way. For example, if a combo has two cards that
            would be abbreviated "Jace", then the full name of each card is
            spelled out.
          </li>
          <li>
            This is not the case in the "Card Names" section of a combo, where
            card names are always written out in full.
          </li>
        </ul>
      </li>
    </ul>

    <h4 id="mana-symbol-order">Mana Symbol Order in Prerequisites and Steps</h4>
    <ul>
      <li>
        Costs are always written with the generic mana symbol first.

        <ul>
          <li>
            <TextWithMagicSymbol text="{x}" /> comes before the generic mana
            symbol, and is the only symbol for which this is the case as of when
            this is being written.
          </li>
        </ul>
      </li>

      <li>
        Colorless and mono-colored mana symbols are always listed at the end of
        a cost, with the colorless symbol always coming before the colored mana
        symbols. For all of the following cases, you may reference how EDHRec
        sequences its colors in the "Commanders" dropdown rather than using
        these explanations to figure it out yourself.

        <ul>
          <li>
            For two allied colors, the one that comes first in WUBRG order is
            written first, with G being considered to come before W.
          </li>
          <li>
            For two enemy colors, the one that would only have to advance 2
            positions forward in WUBRG order (rather than 3) comes first.
          </li>
          <li>
            For three colors, the primary color of the wedge/shard (the enemy of
            both in the wedge, the ally of both in the shard) goes in the
            middle, and the two colors on the left and right are placed based on
            where they are positioned in the color pie relative to the primary
            color.
          </li>
          <li>
            For four colors, they are listed in WUBRG order starting with the
            one after the missing color.
          </li>
        </ul>
      </li>
      <li>
        Phyrexian mana symbols are treated the same way as colored mana symbols
        are, but should be placed before normal colored mana symbols. The
        notation for it is:
        <ul>
          <li><TextWithMagicSymbol text="{wp}" /> <code>{wp}</code></li>
          <li><TextWithMagicSymbol text="{up}" /> <code>{up}</code></li>
          <li><TextWithMagicSymbol text="{bp}" /> <code>{bp}</code></li>
          <li><TextWithMagicSymbol text="{rp}" /> <code>{rp}</code></li>
          <li><TextWithMagicSymbol text="{gp}" /> <code>{gp}</code></li>
        </ul>
      </li>
      <li>
        Energy is not a mana symbol and should not be grouped with mana symbols.
      </li>
      <li>
        All other unmentioned mana symbols should go between the generic and
        colored mana symbols.

        <ul>
          <li>
            There are some mana symbol combinations with no precedent, like
            Phyrexian mana with any kind of of symbol outside of X or generic,
            snow with
          </li>
        </ul>
      </li>
    </ul>

    <h4 id="attached-equipped-fortified-enchanted">
      Attached, Equipped, Fortified, and Enchanted
    </h4>
    <ul>
      <li>
        Attach is the verb, and should be used when an equipment, aura, or
        fortification is being attached to something.

        <ul>
          <li>
            An example for an equipment would be "Activate [the named equipment]
            by paying [mana cost], attaching it to [target creature]".
          </li>
          <li>
            The verbs equip, enchant, and fortify should not be used to describe
            attaching something to a permanent or card.
          </li>
        </ul>
      </li>
      <li>
        Equipped, enchanted, and fortified describe the permanent that has an
        equipment, aura, or fortification attached to them, respectively.

        <ul>
          <li>Attached should never be used in these cases.</li>
        </ul>
      </li>
    </ul>

    <h4 id="capitalization">Capitalization</h4>
    <ul>
      <li>
        Proper nouns (names of people, places, and things) and beginnings of
        sentences need to be capitalized.
      </li>
      <li>
        Card subtypes must be capitalized, meaning stuff like Aura, Treasure,
        Locus, and Elf.

        <ul>
          <li>
            Note that this does not apply to card types or supertypes. Why? Good
            question. But if you look at Magic cards, that's how they do things.
            Presumably, it is because something like "enchantment" is just a
            word or "basic" is just an adjective, which subtypes are treated as
            names.
          </li>
        </ul>
      </li>
    </ul>

    <h4 id="numbers-numerals">Numbers vs. Numerals</h4>
    <ul>
      <li>
        Numbers that could be written with a singular English word (like one, or
        twenty) should be spelled out, while multi-word numbers (like 24) should
        be written as numerals.

        <ul>
          <li>
            If it is in a context where a Magic card would use a numeral, such
            as with +1/+1 counters, disregard the previous rule and write the
            numerals anyway. If you are not sure, try and find a recently
            printed Magic card that uses the terminology.
          </li>
        </ul>
      </li>
    </ul>

    <h4 id="contractions">Contractions</h4>
    <ul>
      <li>Don't [sic] use contractions. Like, ever.</li>
      <li>Cannot [sic] is a contraction. Don't [sic] use it.</li>
    </ul>

    <h4 id="card-names">Spelling</h4>
    <ul>
      <li>
        The Commander Spellbook uses American English. Wizards of the Coast uses
        American English, and so do we.
      </li>
    </ul>
    <hr />

    <h3 class="heading-subtitle">Card Names</h3>

    <h4 id="general-card-names">General</h4>
    <ul>
      <li>
        All card names should be written out in full. No abbreviations,
        nicknames, etc.

        <ul>
          <li>
            Note that this is different from how they are handled in other
            sections of the combo, where abbreviations are permitted in some
            cases.
          </li>
        </ul>
      </li>
      <li>
        Adventure cards should only be listed as the non-adventure part of the
        card.
      </li>
      <li>Split cards should be written as "[side 1] // [side 2]".</li>
      <li>
        Flip Cards (the ones you rotate from Kamigawa) should only be listed as
        the unflipped "side" of the card.
      </li>
      <li>
        Modal double-faced cards and transforming double-faced cards should be
        listed as "[front face] // [back face]".
      </li>
    </ul>

    <h4 id="name-ordering">Card Name Ordering</h4>
    <ul>
      <li>
        The least replaceable piece of a combo should be farthest to the left,
        with less replaceable pieces further to the right.
      </li>
    </ul>

    <hr />

    <h3 class="heading-subtitle">Prerequisites</h3>

    <h4 id="card-zones">Cards and Zones</h4>
    <ul>
      <li>
        If all cards are in the same zone, it should be written as "All cards in
        [zone name]." or in the case of the battlefield "All permanents on the
        battlefield."
      </li>
      <li>
        If there is one card in a specific zone, it should be written as "[card
        name] in [zone name]." or in the case of the battlefield "[card name] on
        the battlefield."

        <ul>
          <li>
            For multiple cards in the same zone, it should be written as "[card
            name], and [card name] in [zone name]." Additional cards can be
            added to that clause as needed.
          </li>
        </ul>
      </li>
      <li>No cards may begin a combo on the stack.</li>
    </ul>

    <h4 id="pre-ordering">Prerequisite Ordering</h4>
    <ul>
      <li>What zones the cards you require begin in always comes first.</li>
      <li>The mana required for the combo always comes last.</li>
      <li>
        Miscellaneous results go in between; a more strict hierarchy may
        eventually be defined.
      </li>
    </ul>

    <h4 id="summoning-sickness">Summoning Sickness</h4>
    <ul>
      <li>
        When you have a creature on the battlefield that must either attack or
        use an activated ability involving tapping as a cost, one should say
        "[creature name] does not have summoning sickness."
        <ul>
          <li>
            The exception to this rule is when a permanent goes from being a
            creature to being a noncreature. As a noncreature, it may have its
            activated abilities that have tapping as a cost activated despite
            having summoning sickness. Therefore, there is no need to reference
            summoning sickness in such a case.
          </li>
        </ul>
      </li>
      <li>
        Noncreature permanents do not suffer from summoning sickness and
        therefore do not need to mention summoning sickness.

        <ul>
          <li>
            The exception to this rule is when a permanent goes from being a
            noncreature to being a creature. As a creature, it may only attack
            or have its activated abilities involving tapping as a cost
            activated if it does not have summoning sickness. Therefore,
            summoning sickness should be referenced in such a case.
          </li>
        </ul>
      </li>
    </ul>

    <h4 id="modal-double-faced">
      Modal Double-Faced Cards and Transforming Double-Faced Cards
    </h4>
    <ul>
      <li>
        Only the faces referenced in the combo need to be referenced in the
        prerequisites.
      </li>
    </ul>

    <hr />

    <h3 class="heading-subtitle">Steps</h3>

    <h4 id="cost-and-effects">Costs and Effects</h4>
    <ul>
      <li>
        Steps involving casting spells or activating abilities can be broken
        into two parts: cost and effect. The parts are generally separated by a
        comma.
      </li>
      <li>
        In some cases, a triggered ability may occur in between paying the cost
        of and the resolution of a spell or activated ability, or priority may
        be held and additional spells may be cast or activated abilities may be
        activated. See
        <a href="#delayed-resolution">Delayed Resolution</a> for how to handle
        such cases.
      </li>
    </ul>

    <h4 id="dividing-steps">Dividing up Steps</h4>
    <ul>
      <li>Each individual action taken by the player is its own step.</li>
      <li>
        If there is only one trigger occuring, one spell being cast, or one
        ability being activated, the activation and resolution should be part of
        the step.

        <ul>
          <li>
            In some cases, something else will be put onto the stack before the
            one spell, ability, or trigger is able to resolve. See
            <a href="#delayed-resolution">Delayed Resolution</a> for how to
            handle such cases.
          </li>
        </ul>
      </li>
      <li>
        When there are multiple abilities triggering at the same time, there
        should be a step listing all of the triggers that occurred, followed by
        each trigger being resolved in its own step.

        <ul>
          <li>
            The resolving triggers should be listed in the same order as the
            named triggered abilities were listed.
          </li>
        </ul>
      </li>
    </ul>

    <h4 id="delayed-resolution">Delayed Resolution</h4>
    <ul>
      <li>
        Sometimes, you will need to delay the resolution of a trigger, activated
        ability, or spell that has been cast due to casting spell(s) or
        activating ability(ies) in response, or trigger(s) going onto the stack.
      </li>
      <li>
        This can be broken down into multiple steps: how to handle referring to
        the item being put onto the stack, how to handle intervening
        triggers/actions, and how to handle the resolution of the original
        effect.

        <ul>
          <li>
            When referring to the item being put onto the stack:

            <ul>
              <li>For a triggered ability, say "[card name] triggers."</li>
              <li>
                For casting a spell, say "Cast [card name]." Make sure to
                include any costs that need mentioning.
              </li>
              <li>
                For activating an ability, say "Activate [card name]." Make sure
                to include any costs that need mentioning. If there are multiple
                activateable abilities on the card that could be activated, make
                it clear which one is being activated.
              </li>
            </ul>
          </li>
        </ul>
        <ul>
          <li>
            When referring to the step immediately afterwards:

            <ul>
              <li>
                For an intervening trigger, nothing special is needed. Just use
                the standard "~ triggers" and deal with the trigger as normal.
              </li>
              <li>
                For an intervening spell cast or ability activation, say "In
                response, " then continue resolving the spell or ability
                activation as normal.
              </li>
            </ul>
          </li>
        </ul>
        <ul>
          <li>
            When resolving the original effect:

            <ul>
              <li>
                For a trigger, say "Resolve the ~ trigger, " then continue with
                the effect of said trigger (If the card name starts with the
                word "the", instead say "Resolve ~'s trigger").
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        For resolving a spell, say "Resolve ~, " then continue with the effects
        of the spell as needed.
      </li>
      <li>
        For resolving an activated ability, say "Resolve the ~ ability, " then
        continue with the effect of said trigger.

        <ul>
          <li>
            If the card name starts with the word "the", instead say "Resolve
            ~'s ability".
          </li>
        </ul>
      </li>
    </ul>

    <h4 id="adding-spending-mana">Adding, Spending, and Not Spending Mana</h4>
    <ul>
      <li>
        All combos need to say how much mana and what kinds of mana are added
        when mana is added.
      </li>
      <li>
        Combos must state what kinds of mana are being spent and in what
        quantities said types of mana are being spent.
      </li>
      <li>
        The amount of unspent mana should only be referenced when directly
        pertinent to the cards involved, such as with Doubling Cube.
      </li>
      <li>
        Mana that is left unspent should be referred to as unspent mana. For
        example, a step that leaves two black mana unspent should end with
        "leaving {b}{b} unspent."

        <ul>
          <li>The mana pool does not exist and should not be referenced.</li>
          <li>
            "Floating" mana is a slang term that refers to the same thing, and
            should not be used.
          </li>
        </ul>
      </li>
    </ul>

    <h4 id="repeats">Repeats</h4>
    <ul>
      <li>
        When every step within a combo makes up an infinite loop, the last step
        of the combo should read "repeat".
      </li>
      <li>
        When all but the first number of steps make up an infinite loop, the
        last step of the combo should read "repeat from step ~".
      </li>
      <li>
        When a certain group of steps need to be repeated that do not fit into
        either category, the step following the last step in the loop should
        read "repeat steps ~1 through ~2".
      </li>
    </ul>

    <hr />

    <h3 class="heading-subtitle">Results</h3>

    <h4 id="general-results">General Results</h4>
    <ul>
      <li>
        Results should be formatted as they are in the search tips of the
        website.

        <ul>
          <li>
            There are two current exceptions: infinite copies (which we do not
            do at all) and infinite loot (which we use infinite looting for).
            Note that at the time you are reading this, these mistakes may have
            already been corrected.
          </li>
        </ul>
      </li>
      <li>
        If the result you're looking at is not in the search tips of the
        website, search the website for another combo that has a similar result
        and see what was done in that case. Note that there is no guarantee that
        said combo will be formatted or worded correctly.
      </li>
    </ul>

    <h4 id="extra-turns">Extra Turns</h4>
    <ul>
      <li>
        Extra turns are considered infinite despite the fact that you eventually
        deck yourself due to card draw.
      </li>
      <li>
        Effects that occur once or twice per extra turn are not considered
        infinite.

        <ul>
          <li>
            For example, playing a land on each of your extra turns is not
            infinite landfall.
          </li>
        </ul>
      </li>
    </ul>

    <hr />

    <h3 class="heading-subtitle">Glossary</h3>

    <h4 id="zone-names">Zone Names</h4>
    <ul>
      <li>Battlefield</li>
      <li>Graveyard</li>
      <li>Library</li>
      <li>Hand</li>
      <li>Exile</li>
      <li>The command zone</li>
      <li>The stack</li>
      <li>The ante zone</li>
    </ul>

    <h4 id="unofficial-terms">Unofficial MTG Terms Used</h4>

    <ul>
      <li>ETB: Enters the battlefield</li>
      <li>LTB: Leaves the battlefield</li>
      <li>Loot/ing: Draw a card, then discard a card</li>
      <li>Rummage/ing: Discard a card, then draw a card</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ArtCircle from "@/components/ArtCircle.vue";
import ExternalLink from "@/components/ExternalLink.vue";
import TextWithMagicSymbol from "@/components/TextWithMagicSymbol.vue";

export default Vue.extend({
  components: {
    ArtCircle,
    ExternalLink,
    TextWithMagicSymbol,
  },
});
</script>
<style scoped>
p {
  @apply my-2;
}

h4 {
  @apply text-lg mt-4 mb-2 font-bold;
}

ul {
  @apply list-disc list-inside;
}

ul ul {
  @apply ml-8;
}

hr {
  @apply my-4;
}

code {
  @apply bg-gray-200 px-1 mx-1;
}
</style>
