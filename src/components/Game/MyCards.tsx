import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "react-beautiful-dnd"
import { EMPTY, Card, CardName } from "model/Cards"
import { RoundStatus } from "model/Round"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import { CardContent, CardMedia, useTheme } from "@mui/material"
import {
    clearSelectedCards,
    getCardsFull,
    getGameId,
    getIamGoer,
    getIsMyGo,
    getIsRoundCalled,
    getRound,
    replaceMyCards,
    toggleSelect,
    toggleUniqueSelect,
} from "caches/GameSlice"
import { useGameActions } from "components/Hooks/useGameActions"

const EMPTY_HAND = [
    { ...EMPTY, selected: false },
    { ...EMPTY, selected: false },
    { ...EMPTY, selected: false },
    { ...EMPTY, selected: false },
    { ...EMPTY, selected: false },
]

const MyCards = () => {
    const dispatch = useAppDispatch()
    const theme = useTheme()
    const { playCard } = useGameActions()

    const gameId = useAppSelector(getGameId)
    const round = useAppSelector(getRound)
    const isRoundCalled = useAppSelector(getIsRoundCalled)
    const myCards = useAppSelector(getCardsFull)
    const [autoPlayCard, setAutoPlayCard] = useState<CardName>(CardName.EMPTY)
    const iamGoer = useAppSelector(getIamGoer)
    const isMyGo = useAppSelector(getIsMyGo)

    const cardsSelectable = useMemo(
        () =>
            round &&
            [
                RoundStatus.CALLED,
                RoundStatus.BUYING,
                RoundStatus.PLAYING,
            ].includes(round.status),
        [round],
    )

    const showDummy = useMemo(
        () => isRoundCalled && iamGoer,
        [isRoundCalled, iamGoer],
    )

    useEffect(() => {
        if (
            autoPlayCard !== CardName.EMPTY &&
            round &&
            round.status === RoundStatus.PLAYING &&
            isMyGo
        ) {
            playCard({ gameId: gameId!, card: autoPlayCard })
            setAutoPlayCard(CardName.EMPTY)
        }
    }, [autoPlayCard, round, gameId, isMyGo])

    const handleSelectCard = useCallback(
        (card: Card, event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
            if (!cardsSelectable || card.name === EMPTY.name) {
                return
            }

            // If the round status is PLAYING then only allow one card to be selected
            if (gameId && round && round.status === RoundStatus.PLAYING) {
                if (autoPlayCard === card.name) {
                    setAutoPlayCard(CardName.EMPTY)
                    dispatch(clearSelectedCards())
                } else if (event.detail === 2) {
                    setAutoPlayCard(card.name)
                } else {
                    dispatch(toggleUniqueSelect(card))
                    setAutoPlayCard(CardName.EMPTY)
                }
            } else {
                dispatch(toggleSelect(card))
            }
        },
        [round, autoPlayCard],
    )

    const handleOnDragEnd = useCallback(
        (result: DropResult) => {
            if (!result.destination) return

            const updatedCards = myCards.map(c => {
                return { ...c }
            })
            const [reorderedItem] = updatedCards.splice(result.source.index, 1)
            updatedCards.splice(result.destination.index, 0, reorderedItem)

            dispatch(replaceMyCards(updatedCards))
        },
        [myCards],
    )

    const handleOnDragEndDummy = useCallback(
        (result: DropResult) => {
            if (!result.destination) return

            const updatedCards = myCards.map(c => {
                return { ...c }
            })
            const [reorderedItem] = updatedCards.splice(
                result.source.index + 5,
                1,
            )
            updatedCards.splice(result.destination.index + 5, 0, reorderedItem)

            dispatch(replaceMyCards(updatedCards))
        },
        [myCards],
    )

    const getStyleForCard = useCallback(
        (card: Card) => {
            let classes = "thumbnail-size"

            if (cardsSelectable && card.name !== EMPTY.name) {
                if (card.name === autoPlayCard) {
                    classes += " auto-played-" + theme.palette.mode
                } else if (!card.selected) {
                    classes += " cardNotSelected"
                }
            }

            return classes
        },
        [cardsSelectable, autoPlayCard, theme],
    )

    return (
        <div>
            <CardContent className="card-area card-root">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="myCards" direction="horizontal">
                        {provided => (
                            <div
                                className="characters my-cards cards-background"
                                style={{ display: "inline-flex" }}
                                {...provided.droppableProps}
                                ref={provided.innerRef}>
                                {myCards.slice(0, 5).map((card, index) => {
                                    const draggableId = `${card.name}${
                                        card.name === EMPTY.name ? index : ""
                                    }`
                                    return (
                                        <Draggable
                                            key={draggableId}
                                            draggableId={draggableId}
                                            index={index}
                                            isDragDisabled={
                                                card.name === EMPTY.name
                                            }>
                                            {provided => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <CardMedia
                                                        component="img"
                                                        alt={card.name}
                                                        onClick={event =>
                                                            handleSelectCard(
                                                                card,
                                                                event,
                                                            )
                                                        }
                                                        image={`/cards/thumbnails/${card.name}.png`}
                                                        className={getStyleForCard(
                                                            card,
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </CardContent>

            <CardContent className="card-area card-root">
                <DragDropContext onDragEnd={handleOnDragEndDummy}>
                    <Droppable droppableId="dummy" direction="horizontal">
                        {provided => (
                            <div
                                className="characters my-cards dummy"
                                style={{ display: "inline-flex" }}
                                {...provided.droppableProps}
                                ref={provided.innerRef}>
                                {(showDummy
                                    ? myCards.slice(5, 10)
                                    : EMPTY_HAND
                                ).map((card, index) => {
                                    const draggableId = `${card.name}${
                                        card.name === EMPTY.name ? index : ""
                                    }`
                                    return (
                                        <Draggable
                                            key={draggableId}
                                            draggableId={draggableId}
                                            index={index}
                                            isDragDisabled={
                                                card.name === EMPTY.name
                                            }>
                                            {provided => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <CardMedia
                                                        component="img"
                                                        alt={card.name}
                                                        onClick={event =>
                                                            handleSelectCard(
                                                                card,
                                                                event,
                                                            )
                                                        }
                                                        image={`/cards/thumbnails/${card.name}.png`}
                                                        className={getStyleForCard(
                                                            card,
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </CardContent>
        </div>
    )
}

export default MyCards
