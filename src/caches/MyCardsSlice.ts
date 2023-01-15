import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { BLANK_CARD, SelectableCard } from "../model/Cards"
import { processOrderedCardsAfterGameUpdate } from "../utils/GameUtils"
import { RootState } from "./caches"

export interface MyCardsState {
    cards: SelectableCard[]
}

const initialState: MyCardsState = {
    cards: [],
}

export const myCardsSlice = createSlice({
    name: "myCards",
    initialState: initialState,
    reducers: {
        updateMyCards: (state, action: PayloadAction<string[]>) => {
            return {
                cards: processOrderedCardsAfterGameUpdate(
                    state.cards,
                    action.payload,
                ),
            }
        },
        replaceMyCards: (_, action: PayloadAction<SelectableCard[]>) => {
            return {
                cards: action.payload,
            }
        },
        toggleSelect: (state, action: PayloadAction<SelectableCard>) =>
            state.cards.forEach(c => {
                if (c.name === action.payload.name) c.selected = !c.selected
            }),
        toggleUniqueSelect: (state, action: PayloadAction<SelectableCard>) =>
            state.cards.forEach(c => {
                if (c.name === action.payload.name) c.selected = !c.selected
                else c.selected = false
            }),
        clearSelectedCards: state => {
            state.cards.forEach(c => {
                c.selected = false
            })
        },
        clearMyCards: () => initialState,
    },
})

export const {
    updateMyCards,
    replaceMyCards,
    clearSelectedCards,
    toggleSelect,
    toggleUniqueSelect,
    clearMyCards,
} = myCardsSlice.actions

export const getMyCards = (state: RootState) => state.myCards.cards
export const getMyCardsWithoutBlanks = (state: RootState) =>
    state.myCards.cards.filter(c => c.name !== BLANK_CARD.name)
