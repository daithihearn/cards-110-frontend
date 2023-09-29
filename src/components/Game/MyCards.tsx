import React, { useCallback, useEffect, useMemo, useRef } from "react"
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "react-beautiful-dnd"
import { EMPTY, SelectableCard } from "model/Cards"
import { RoundStatus } from "model/Round"
import {
    getGameId,
    getIamGoer,
    getIsRoundCalled,
    getRound,
    getNumPlayers,
} from "caches/GameSlice"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import {
    clearSelectedCards,
    getMyCards,
    replaceMyCards,
    selectCards,
    toggleSelect,
    toggleUniqueSelect,
} from "caches/MyCardsSlice"
import {
    getCardToPlay,
    togglePlayCard,
    clearAutoPlay,
} from "caches/PlayCardSlice"
import { CardContent, CardMedia, useTheme } from "@mui/material"
import { pickBestCards } from "utils/GameUtils"

const EMPTY_HAND = [
    { ...EMPTY, selected: false },
    { ...EMPTY, selected: false },
    { ...EMPTY, selected: false },
    { ...EMPTY, selected: false },
    { ...EMPTY, selected: false },
]

const usePrevious = (value: any) => {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}

const MyCards: React.FC = () => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const round = useAppSelector(getRound)
    const gameId = useAppSelector(getGameId)
    const numPlayers = useAppSelector(getNumPlayers)
    const isRoundCalled = useAppSelector(getIsRoundCalled)
    const myCards = useAppSelector(getMyCards)
    const autoPlayCard = useAppSelector(getCardToPlay)
    const iamGoer = useAppSelector(getIamGoer)
    const prevRoundStatus = usePrevious(round?.status)

    useEffect(() => {
        if (
            round?.status === RoundStatus.BUYING &&
            prevRoundStatus !== RoundStatus.BUYING &&
            !iamGoer &&
            round.suit
        ) {
            // Auto select all cards of a specific suit when the round status is BUYING
            const bestCards = pickBestCards(myCards, round.suit, numPlayers)

            dispatch(selectCards(bestCards))
        }
    }, [round, numPlayers, gameId, myCards, prevRoundStatus, iamGoer])

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

    const handleSelectCard = useCallback(
        (
            card: SelectableCard,
            event: React.MouseEvent<HTMLImageElement, MouseEvent>,
        ) => {
            if (!cardsSelectable || card.name === EMPTY.name) {
                return
            }

            // If the round status is PLAYING then only allow one card to be selected
            if (round && round.status === RoundStatus.PLAYING) {
                if (autoPlayCard === card.name) {
                    dispatch(clearAutoPlay())
                    dispatch(clearSelectedCards())
                } else if (event.detail === 2) {
                    dispatch(togglePlayCard(card))
                } else {
                    dispatch(toggleUniqueSelect(card))
                    dispatch(clearAutoPlay())
                }
            } else {
                dispatch(toggleSelect(card))
            }
        },
        [round, myCards, autoPlayCard],
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
        (card: SelectableCard) => {
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
