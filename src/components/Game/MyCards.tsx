import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Button, ButtonGroup, CardImg, CardBody } from "reactstrap"
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd"
import { BLANK_CARD, PlayableCard } from "../../model/Cards"

import GameService from "../../services/GameService"
import { RoundStatus } from "../../model/Round"
import {
  clearSelectedCards,
  getGame,
  updateCards,
} from "../../caches/GameSlice"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { useSnackbar } from "notistack"

interface DoubleClickTracker {
  time: number
  card: PlayableCard
}

const MyCards: React.FC = () => {
  const dispatch = useAppDispatch()
  const game = useAppSelector(getGame)
  const { enqueueSnackbar } = useSnackbar()

  const [doubleClickTracker, updateDoubleClickTracker] =
    useState<DoubleClickTracker>()

  const selectedCards = useMemo(
    () => game.cards.filter((c) => c.selected),
    [game]
  )

  const playButtonEnabled = useMemo(
    () =>
      game.isMyGo &&
      game.round &&
      game.round.status === RoundStatus.PLAYING &&
      game.round.completedHands.length +
        game.cards.filter((c) => c.name !== BLANK_CARD.name).length ===
        5,

    [game]
  )

  const cardsSelectable = useMemo(
    () =>
      game.round &&
      [RoundStatus.CALLED, RoundStatus.BUYING, RoundStatus.PLAYING].includes(
        game.round.status
      ),
    [game]
  )

  const handleSelectCard = useCallback(
    (card: PlayableCard) => {
      if (!cardsSelectable || card.name === BLANK_CARD.name) {
        return
      }

      const updatedCards = game.cards.map((c) => {
        return { ...c }
      })

      // If the round status is PLAYING then only allow one card to be selected
      if (game.round && game.round.status === RoundStatus.PLAYING) {
        if (
          !!doubleClickTracker &&
          doubleClickTracker.card === card &&
          Date.now() - doubleClickTracker.time < 500
        ) {
          updatedCards.forEach((c) => {
            if (c.name === card.name) {
              c.selected = true
              c.autoplay = true
            }
          })
        } else if (!card.selected) {
          updatedCards.forEach((c) => {
            if (c.name === card.name) {
              c.selected = true
              c.autoplay = false
            } else {
              c.selected = false
              c.autoplay = false
            }
          })
          updateDoubleClickTracker({ time: Date.now(), card: card })
        } else {
          updateDoubleClickTracker({ time: Date.now(), card: card })
          dispatch(clearSelectedCards())
          return
        }
      } else {
        updatedCards.forEach((c) => {
          if (c.name === card.name) {
            c.selected = !c.selected
          }
        })
      }

      dispatch(updateCards(updatedCards))
    },
    [game, doubleClickTracker]
  )

  const handleOnDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    const newCards = Array.from(game.cards)
    const [reorderedItem] = newCards.splice(result.source.index, 1)
    newCards.splice(result.destination.index, 0, reorderedItem)

    dispatch(updateCards(newCards))
  }, [])

  const getStyleForCard = (card: PlayableCard) => {
    let classes = "thumbnail_size "

    if (cardsSelectable && card.name !== BLANK_CARD.name) {
      if (card.autoplay) {
        classes += "cardAutoPlayed"
      } else if (!card.selected) {
        classes += "cardNotSelected"
      }
    }

    return classes
  }

  const playCard = useCallback(() => {
    if (selectedCards.length !== 1) {
      enqueueSnackbar("Please select exactly one card to play")
    } else {
      dispatch(GameService.playCard(game.id!, selectedCards[0])).catch(
        enqueueSnackbar
      )
    }
  }, [game])

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
                {game.cards.map((card, index) => {
                  return (
                    <Draggable
                      key={`${card.name}-${index}`}
                      draggableId={`${card.name}-${index}`}
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

      {game.round!.status === RoundStatus.PLAYING ? (
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
