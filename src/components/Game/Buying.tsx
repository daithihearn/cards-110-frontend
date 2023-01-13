import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  ButtonGroup,
  Form,
  CardImg,
  CardBody,
  CardGroup,
  Card,
} from "reactstrap"

import { useCallback, useMemo, useState } from "react"

import GameService from "../../services/GameService"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { useSnackbar } from "notistack"
import { getMyCardsWithoutBlanks } from "../../caches/MyCardsSlice"
import {
  getGameId,
  getIsMyGo,
  getIsRoundBuying,
  getSuit,
} from "../../caches/GameSlice"
import {
  removeAllFromHand,
  riskOfMistakeBuyingCards,
} from "../../utils/GameUtils"

const Buying = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const gameId = useAppSelector(getGameId)
  const suit = useAppSelector(getSuit)
  const myCards = useAppSelector(getMyCardsWithoutBlanks)
  const isBuying = useAppSelector(getIsRoundBuying)
  const isMyGo = useAppSelector(getIsMyGo)

  const [deleteCardsDialog, updateDeleteCardsDialog] = useState(false)

  const selectedCards = useMemo(
    () => myCards.filter((c) => c.selected),
    [myCards]
  )

  const buyCards = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (riskOfMistakeBuyingCards(suit!, selectedCards, myCards)) {
        showCancelDeleteCardsDialog()
      } else {
        dispatch(GameService.buyCards(gameId!, selectedCards)).catch((e) =>
          enqueueSnackbar(e.message, { variant: "error" })
        )
      }
    },
    [gameId, suit, selectedCards, myCards]
  )

  const hideCancelDeleteCardsDialog = useCallback(() => {
    updateDeleteCardsDialog(false)
  }, [updateDeleteCardsDialog])

  const showCancelDeleteCardsDialog = () => {
    updateDeleteCardsDialog(true)
  }

  return (
    <div>
      {isBuying ? (
        <CardBody className="buttonArea">
          <Form onSubmit={buyCards}>
            <ButtonGroup size="lg">
              {isMyGo ? (
                <Button type="submit" color="warning">
                  <b>Keep Cards</b>
                </Button>
              ) : null}
            </ButtonGroup>
          </Form>

          <Modal
            fade={true}
            size="lg"
            toggle={hideCancelDeleteCardsDialog}
            isOpen={deleteCardsDialog}
          >
            <ModalHeader>
              <CardImg
                alt="Suit"
                src={`/cards/originals/${suit}_ICON.svg`}
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
                    {removeAllFromHand(selectedCards, myCards).map((card) => (
                      <img
                        key={"deleteCardModal_" + card}
                        alt={card.name}
                        src={"/cards/thumbnails/" + card + ".png"}
                        className="thumbnail_size"
                      />
                    ))}
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
                      <Button type="button" color="warning" onClick={buyCards}>
                        Throw Cards
                      </Button>
                    </ButtonGroup>
                  </CardBody>
                </Card>
              </CardGroup>
            </ModalBody>
          </Modal>
        </CardBody>
      ) : null}
    </div>
  )
}

export default Buying
