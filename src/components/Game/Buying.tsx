import { Button, ButtonGroup, Form, CardBody } from "reactstrap"

import { useCallback, useState } from "react"

import GameService from "../../services/GameService"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { useSnackbar } from "notistack"
import {
    getMyCardsWithoutBlanks,
    getSelectedCards,
} from "../../caches/MyCardsSlice"
import {
    getGameId,
    getIsMyGo,
    getIsRoundBuying,
    getSuit,
} from "../../caches/GameSlice"
import { riskOfMistakeBuyingCards } from "../../utils/GameUtils"
import ThrowCardsWarningModal from "./ThrowCardsWarningModal"
import { SelectableCard } from "../../model/Cards"

const Buying = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()
    const gameId = useAppSelector(getGameId)
    const suit = useAppSelector(getSuit)
    const myCards = useAppSelector(getMyCardsWithoutBlanks)
    const isBuying = useAppSelector(getIsRoundBuying)
    const isMyGo = useAppSelector(getIsMyGo)

    const [deleteCardsDialog, updateDeleteCardsDialog] = useState(false)

    const selectedCards = useAppSelector(getSelectedCards)

    const buyCardsFormSubmit = useCallback(
        (e?: React.FormEvent) => {
            if (e) e.preventDefault()
            if (!gameId) throw Error("No game id set")

            if (riskOfMistakeBuyingCards(suit!, selectedCards, myCards))
                showCancelDeleteCardsDialog()
            else buyCards(gameId, selectedCards)
        },
        [gameId, suit, selectedCards, myCards],
    )

    const buyCards = (id: string, sel: SelectableCard[]) => {
        console.log(`Keeping cards: ${JSON.stringify(sel)}`)
        dispatch(GameService.buyCards(id, sel)).catch(e =>
            enqueueSnackbar(e.message, { variant: "error" }),
        )
    }

    const hideCancelDeleteCardsDialog = useCallback(() => {
        updateDeleteCardsDialog(false)
    }, [])

    const showCancelDeleteCardsDialog = () => {
        updateDeleteCardsDialog(true)
    }

    return (
        <div>
            {isBuying ? (
                <CardBody className="buttonArea">
                    <Form onSubmit={buyCardsFormSubmit}>
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
                    />
                </CardBody>
            ) : null}
        </div>
    )
}

export default Buying
