import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CardName, EMPTY, SelectableCard } from "model/Cards"
import { processOrderedCardsAfterGameUpdate } from "utils/GameUtils"
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
        updateMyCards: (state, action: PayloadAction<CardName[]>) => {
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
        removeCard: (state, action: PayloadAction<string>) => {
            const idx = state.cards.findIndex(c => c.name === action.payload)
            if (idx > 0) state.cards[idx] = { ...EMPTY, selected: false }
        },
        selectCard: (state, action: PayloadAction<SelectableCard>) => {
            state.cards.forEach(c => {
                if (c.name === action.payload.name) c.selected = true
            })
        },
        selectCards: (state, action: PayloadAction<SelectableCard[]>) => {
            state.cards.forEach(c => {
                if (action.payload.some(a => a.name === c.name))
                    c.selected = true
            })
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
        selectAll: state => {
            state.cards.forEach(c => {
                if (c.name !== EMPTY.name) c.selected = true
            })
        },
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
    removeCard,
    clearSelectedCards,
    selectAll,
    selectCard,
    selectCards,
    toggleSelect,
    toggleUniqueSelect,
    clearMyCards,
} = myCardsSlice.actions

export const getMyCards = (state: RootState) => state.myCards.cards

export const getMyCardsWithoutBlanks = createSelector(getMyCards, cards =>
    cards.filter(c => c.name !== EMPTY.name),
)

export const getSelectedCards = createSelector(getMyCards, cards =>
    cards.filter(c => c.selected),
)
