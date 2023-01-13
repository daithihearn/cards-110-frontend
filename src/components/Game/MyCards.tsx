import React, { useCallback, useMemo, useState } from "react"
import { Button, ButtonGroup, CardImg, CardBody } from "reactstrap"
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd"
import { BLANK_CARD, SelectableCard } from "../../model/Cards"

import GameService from "../../services/GameService"
import { RoundStatus } from "../../model/Round"
import { getGameId, getIsMyGo, getRound } from "../../caches/GameSlice"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { useSnackbar } from "notistack"
import {
  getMyCards,
  replaceMyCards,
  toggleSelect,
  toggleUniqueSelect,
} from "../../caches/MyCardsSlice"
import { getAutoPlayCard, toggleAutoPlay } from "../../caches/AutoPlaySlice"

interface DoubleClickTracker {
  time: number
  card: string
}

const MyCards: React.FC = () => {
  const dispatch = useAppDispatch()
  const gameId = useAppSelector(getGameId)
  const round = useAppSelector(getRound)
  const myCards = useAppSelector(getMyCards)
  const autoPlayCard = useAppSelector(getAutoPlayCard)
  const isMyGo = useAppSelector(getIsMyGo)

  const { enqueueSnackbar } = useSnackbar()

  const [doubleClickTracker, updateDoubleClickTracker] =
    useState<DoubleClickTracker>()

  const selectedCards = useMemo(
    () => myCards.filter((c) => c.selected),
    [myCards]
  )

  const playButtonEnabled = useMemo(
    () =>
      isMyGo &&
      round &&
      round.status === RoundStatus.PLAYING &&
      round.completedHands.length +
        myCards.filter((c) => c.name !== BLANK_CARD.name).length ===
        5,

    [isMyGo, round, myCards]
  )

  const cardsSelectable = useMemo(
    () =>
      round &&
      [RoundStatus.CALLED, RoundStatus.BUYING, RoundStatus.PLAYING].includes(
        round.status
      ),
    [round]
  )

  const handleSelectCard = useCallback(
    (card: SelectableCard) => {
      if (!cardsSelectable || card.name === BLANK_CARD.name) {
        return
      }

      // If the round status is PLAYING then only allow one card to be selected
      if (round && round.status === RoundStatus.PLAYING) {
        if (
          doubleClickTracker &&
          doubleClickTracker.card === card.name &&
          Date.now() - doubleClickTracker.time < 500
        ) {
          dispatch(toggleAutoPlay(card))
        } else dispatch(toggleUniqueSelect(card))

        updateDoubleClickTracker({ card: card.name, time: Date.now() })
      } else {
        dispatch(toggleSelect(card))
      }
    },
    [round, myCards, doubleClickTracker]
  )

  const handleOnDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return

      const updatedCards = myCards.map((c) => {
        return { ...c }
      })
      const [reorderedItem] = updatedCards.splice(result.source.index, 1)
      updatedCards.splice(result.destination.index, 0, reorderedItem)

      dispatch(replaceMyCards(updatedCards))
    },
    [myCards]
  )

  const getStyleForCard = useCallback(
    (card: SelectableCard) => {
      let classes = "thumbnail_size"

      if (cardsSelectable && card.name !== BLANK_CARD.name) {
        if (card.name === autoPlayCard) {
          classes += " cardAutoPlayed"
        } else if (!card.selected) {
          classes += " cardNotSelected"
        }
      }

      return classes
    },
    [cardsSelectable, autoPlayCard]
  )

  const playCard = useCallback(() => {
    if (selectedCards.length !== 1) {
      enqueueSnackbar("Please select exactly one card to play")
    } else {
      dispatch(GameService.playCard(gameId!, selectedCards[0].name)).catch(
        (e) => enqueueSnackbar(e.message, { variant: "error" })
      )
    }
  }, [gameId, selectedCards])

  return (
    <div>
      <CardBody className="cardArea">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters" direction="horizontal">
            {(provided) => (
              <div
                className="characters"
                style={{ display: "inline-flex" }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {myCards.map((card, index) => {
                  const draggableId = `${card.name}${
                    card.name === BLANK_CARD.name ? index : ""
                  }`
                  return (
                    <Draggable
                      key={draggableId}
                      draggableId={draggableId}
                      index={index}
                      isDragDisabled={card.name === BLANK_CARD.name}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <CardImg
                            alt={card.name}
                            onClick={() => handleSelectCard(card)}
                            src={`/cards/thumbnails/${card.name}.png`}
                            className={getStyleForCard(card)}
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
      </CardBody>

      {round?.status === RoundStatus.PLAYING ? (
        <CardBody className="buttonArea">
          <ButtonGroup size="lg">
            <Button
              id="playCardButton"
              disabled={!playButtonEnabled}
              type="button"
              onClick={playCard}
              color="warning"
            >
              <b>Play Card</b>
            </Button>
          </ButtonGroup>
        </CardBody>
      ) : null}
    </div>
  )
}

export default MyCards
