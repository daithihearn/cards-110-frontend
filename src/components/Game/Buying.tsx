import { Button, ButtonGroup, Form, CardBody } from "reactstrap"

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
import ThrowCardsWarningModal from "./ThrowCardsWarningModal"

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
    (e?: React.FormEvent) => {
      if (e) e.preventDefault()
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

          <ThrowCardsWarningModal
            modalVisible={deleteCardsDialog}
            cancelCallback={hideCancelDeleteCardsDialog}
            continueCallback={buyCards}
            suit={suit!}
            cards={removeAllFromHand(selectedCards, myCards)}
          />
        </CardBody>
      ) : null}
    </div>
  )
}

export default Buying
