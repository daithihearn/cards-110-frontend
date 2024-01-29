import { AfterCall, BeforeCall } from "test/data/call/call"
import { determineEvent } from "./EventUtils"
import { Event } from "model/Events"
import {
    AfterCardPlayed,
    BeforeCardPlayed,
} from "test/data/card-played/card-played"
import { AfterPass, BeforePass } from "test/data/pass/pass"
import {
    AfterSelectSuit,
    BeforeSelectSuit,
} from "test/data/select-suit/select-suit"
import { AfterBuy, BeforeBuy } from "test/data/buy-cards/buy-cards"
import { AfterRoundEnd, BeforeRoundEnd } from "test/data/round-end/round-end"
import { AfterHandEnd, BeforeHandEnd } from "test/data/hand-end/hand-end"
import { AfterGameEnd, BeforeGameEnd } from "test/data/game-end/game-end"

describe("determineEvent", () => {
    it("Valid call event", () => {
        const result = determineEvent(BeforeCall, AfterCall)

        expect(result).toBe(Event.Call)
    })

    it("Valid pass event", () => {
        const result = determineEvent(BeforePass, AfterPass)

        expect(result).toBe(Event.Pass)
    })

    it("Valid select suit event", () => {
        const result = determineEvent(BeforeSelectSuit, AfterSelectSuit)

        expect(result).toBe(Event.SelectSuit)
    })

    it("Valid buy cards event", () => {
        const result = determineEvent(BeforeBuy, AfterBuy)

        expect(result).toBe(Event.BuyCards)
    })

    it.only("Valid round end event", () => {
        const result = determineEvent(BeforeRoundEnd, AfterRoundEnd)

        expect(result).toBe(Event.RoundEnd)
    })

    it("Valid hand end event", () => {
        const result = determineEvent(BeforeHandEnd, AfterHandEnd)

        expect(result).toBe(Event.HandEnd)
    })

    it("Valid game end event", () => {
        const result = determineEvent(BeforeGameEnd, AfterGameEnd)

        expect(result).toBe(Event.GameOver)
    })

    it("Valid card played event", () => {
        const result = determineEvent(BeforeCardPlayed, AfterCardPlayed)

        expect(result).toBe(Event.CardPlayed)
    })
})
