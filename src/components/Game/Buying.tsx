import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  ButtonGroup,
  Form,
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

const Buying = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const game = useAppSelector(getGame)

  const [selectedCards, setSelectedCards] = useState<PlayableCard[]>([])
  const [deleteCardsDialog, updateDeleteCardsDialog] = useState(false)

  useEffect(() => {
    if (game.cards) setSelectedCards(game.cards.filter((c) => c.selected))
  }, [game])

  const buyCards = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (riskOfMistakeBuyingCards(game.round!.suit!)) {
        showCancelDeleteCardsDialog()
      } else {
        dispatch(GameService.buyCards(game.id!, selectedCards)).catch((e) =>
          enqueueSnackbar(e.message, { variant: "error" })
        )
      }
    },
    [game, selectedCards]
  )

  const riskOfMistakeBuyingCards = (suit: Suit) => {
    const deletingCards = removeAllFromArray(selectedCards, game.cards)

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

  const hideCancelDeleteCardsDialog = useCallback(() => {
    updateDeleteCardsDialog(false)
  }, [updateDeleteCardsDialog])

  const showCancelDeleteCardsDialog = () => {
    updateDeleteCardsDialog(true)
  }

  if (!game || !game.cards) {
    return null
  }

  return (
    <div>
      {!!game.round && game.round.status === RoundStatus.BUYING ? (
        <CardBody className="buttonArea">
          <Form onSubmit={buyCards}>
            <ButtonGroup size="lg">
              {game.isMyGo ? (
                <Button type="submit" color="warning">
                  <b>Keep Cards</b>
                </Button>
              ) : null}
            </ButtonGroup>
          </Form>

          {!!game.round.currentHand && !!game.players && !!game.round.suit ? (
            <Modal
              fade={true}
              size="lg"
              toggle={hideCancelDeleteCardsDialog}
              isOpen={deleteCardsDialog}
            >
              <ModalHeader>
                <CardImg
                  alt="Suit"
                  src={`/cards/originals/${game.round.suit}_ICON.svg`}
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
                            key={"deleteCardModal_" + card}
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
                          onClick={hideCancelDeleteCardsDialog}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          color="warning"
                          onClick={buyCards}
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
        </CardBody>
      ) : null}
    </div>
  )
}

export default Buying
