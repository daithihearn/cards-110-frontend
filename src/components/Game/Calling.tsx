import { Button, ButtonGroup, CardBody } from "reactstrap"

import GameService from "../../services/GameService"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { getGame, getGameId } from "../../caches/GameSlice"
import { useCallback } from "react"
import { useSnackbar } from "notistack"
import parseError from "../../utils/ErrorUtils"

const Calling = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()
    const gameId = useAppSelector(getGameId)
    const game = useAppSelector(getGame)

    const buttonsEnabled =
        game.round &&
        game.round.currentHand &&
        game.cards.length > 0 &&
        game.isMyGo

    const call = useCallback(
        (callAmount: number) => {
            if (gameId)
                dispatch(GameService.call(gameId, callAmount)).catch(
                    (e: Error) =>
                        enqueueSnackbar(parseError(e), { variant: "error" }),
                )
        },
        [gameId],
    )

    if (!game) {
        return null
    }
    return (
        <div>
            <CardBody className="buttonArea">
                <ButtonGroup size="lg">
                    <Button
                        disabled={!buttonsEnabled}
                        type="button"
                        color="secondary"
                        onClick={() => call(0)}>
                        Pass
                    </Button>
                    {game.players.length === 6 &&
                    ((game.iamDealer && game.maxCall! <= 10) ||
                        game.maxCall! < 10) ? (
                        <Button
                            disabled={!buttonsEnabled}
                            type="button"
                            color="primary"
                            onClick={() => call(10)}>
                            10
                        </Button>
                    ) : null}
                    {(game.iamDealer && game.maxCall! <= 15) ||
                    game.maxCall! < 15 ? (
                        <Button
                            disabled={!buttonsEnabled}
                            type="button"
                            color="warning"
                            onClick={() => call(15)}>
                            15
                        </Button>
                    ) : null}
                    {(game.iamDealer && game.maxCall! <= 20) ||
                    game.maxCall! < 20 ? (
                        <Button
                            disabled={!buttonsEnabled}
                            type="button"
                            color="warning"
                            onClick={() => call(20)}>
                            20
                        </Button>
                    ) : null}
                    {(game.iamDealer && game.maxCall! <= 25) ||
                    game.maxCall! < 25 ? (
                        <Button
                            disabled={!buttonsEnabled}
                            type="button"
                            color="warning"
                            onClick={() => call(25)}>
                            25
                        </Button>
                    ) : null}
                    <Button
                        disabled={!buttonsEnabled}
                        type="button"
                        color="danger"
                        onClick={() => call(30)}>
                        {game.players.length > 2 ? "Jink" : "30"}
                    </Button>
                </ButtonGroup>
            </CardBody>
        </div>
    )
}

export default Calling
