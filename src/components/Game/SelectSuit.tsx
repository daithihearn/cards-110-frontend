import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  ButtonGroup,
  Card,
  CardImg,
  CardBody,
  CardGroup,
} from "reactstrap"

import { useCallback, useEffect, useState } from "react"

import GameService from "../../services/GameService"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { getGame } from "../../caches/GameSlice"
import { PlayableCard } from "../../model/Cards"
import { Suit } from "../../model/Suit"
import { RoundStatus } from "../../model/Round"
import { useSnackbar } from "notistack"

const SelectSuit = () => {
  const dispatch = useAppDispatch()
  const game = useAppSelector(getGame)
  const { enqueueSnackbar } = useSnackbar()

  const [selectedCards, setSelectedCards] = useState<PlayableCard[]>([])
  const [selectedSuit, setSelectedSuit] = useState<Suit>()
  const [possibleIssue, setPossibleIssues] = useState(false)

  useEffect(() => {
    if (game.cards) setSelectedCards(game.cards.filter((c) => c.selected))
  }, [game])

  const selectFromDummy = useCallback(
    (suit: Suit) => {
      // Make sure a suit was selected
      if (
        suit !== Suit.HEARTS &&
        suit !== Suit.DIAMONDS &&
        suit !== Suit.CLUBS &&
        suit !== Suit.SPADES
      ) {
        enqueueSnackbar("Please select a suit!")
        return
      }

      // Check if there is a risk that they made a mistake when selecting the cards
      if (riskOfMistakeBuyingCards(suit)) {
        setSelectedSuit(suit)
        setPossibleIssues(true)
      } else {
        dispatch(
          GameService.chooseFromDummy(game.id!, selectedCards, suit)
        ).catch((e: Error) => enqueueSnackbar(e.message, { variant: "error" }))
      }
    },
    [game, selectedCards, selectedSuit, possibleIssue]
  )

  const hideCancelSelectFromDummyDialog = useCallback(() => {
    setSelectedSuit(undefined)
    setPossibleIssues(false)
  }, [selectedSuit, possibleIssue])

  const riskOfMistakeBuyingCards = (suit: Suit) => {
    let deletingCards = removeAllFromArray(selectedCards, game.cards)

    for (const element of deletingCards) {
      if (
        element.name === "JOKER" ||
        element.name === "ACE_HEARTS" ||
        element.suit === suit
      ) {
        return true
      }
    }

    return false
  }

  const removeAllFromArray = (
    toRemove: PlayableCard[],
    originalArray: PlayableCard[]
  ) => {
    let array = [...originalArray]
    toRemove.forEach((element) => {
      array = removeFromArray(element, array)
    })
    return array
  }

  const removeFromArray = (
    elementValue: PlayableCard,
    originalArray: PlayableCard[]
  ) => {
    let array = [...originalArray] // make a separate copy of the array
    let index = array.indexOf(elementValue)
    if (index !== -1) {
      array.splice(index, 1)
    }

    return array
  }

  if (!game || !game.cards) {
    return null
  }

  return (
    <div>
      {!!game && !!game.round && game.round.status === RoundStatus.CALLED ? (
        <CardBody className="buttonArea">
          {game.iamGoer ? (
            <div>
              <ButtonGroup size="lg">
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => selectFromDummy(Suit.HEARTS)}
                >
                  <img
                    alt="Hearts"
                    src={"/cards/originals/HEARTS_ICON.svg"}
                    className="thumbnail_size_extra_small "
                  />
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => selectFromDummy(Suit.DIAMONDS)}
                >
                  <img
                    alt="Hearts"
                    src={"/cards/originals/DIAMONDS_ICON.svg"}
                    className="thumbnail_size_extra_small "
                  />
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => selectFromDummy(Suit.SPADES)}
                >
                  <img
                    alt="Hearts"
                    src={"/cards/originals/SPADES_ICON.svg"}
                    className="thumbnail_size_extra_small "
                  />
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => selectFromDummy(Suit.CLUBS)}
                >
                  <img
                    alt="Hearts"
                    src={"/cards/originals/CLUBS_ICON.svg"}
                    className="thumbnail_size_extra_small "
                  />
                </Button>
              </ButtonGroup>

              {possibleIssue && selectedSuit ? (
                <Modal
                  fade={true}
                  size="lg"
                  toggle={hideCancelSelectFromDummyDialog}
                  isOpen={possibleIssue}
                >
                  <ModalHeader>
                    <CardImg
                      alt="Suit"
                      src={`/cards/originals/${selectedSuit}_ICON.svg`}
                      className="thumbnail_size_extra_small left-padding"
                    />{" "}
                    Are you sure you want to throw these cards away?
                  </ModalHeader>
                  <ModalBody className="called-modal">
                    <CardGroup className="gameModalCardGroup">
                      <Card
                        className="p-6 tableCloth"
                        style={{ backgroundColor: "#333", borderColor: "#333" }}
                      >
                        <CardBody className="cardArea">
                          {removeAllFromArray(selectedCards, game.cards).map(
                            (card) => (
                              <img
                                key={"cancelSelectFromDummyModal_" + card}
                                alt={card.name}
                                src={"/cards/thumbnails/" + card + ".png"}
                                className="thumbnail_size"
                              />
                            )
                          )}
                        </CardBody>

                        <CardBody className="buttonArea">
                          <ButtonGroup size="lg">
                            <Button
                              type="button"
                              color="primary"
                              onClick={hideCancelSelectFromDummyDialog}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              color="warning"
                              click={selectFromDummy(selectedSuit)}
                            >
                              Throw Cards
                            </Button>
                          </ButtonGroup>
                        </CardBody>
                      </Card>
                    </CardGroup>
                  </ModalBody>
                </Modal>
              ) : null}
            </div>
          ) : (
            <ButtonGroup size="lg">
              <Button disabled type="button" color="primary">
                Please wait for the goer to choose their suit
              </Button>
            </ButtonGroup>
          )}
        </CardBody>
      ) : null}
    </div>
  )
}

export default SelectSuit
