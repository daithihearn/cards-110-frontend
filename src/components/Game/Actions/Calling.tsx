import { Button } from "reactstrap"

import GameService from "../../../services/GameService"
import { useAppDispatch, useAppSelector } from "../../../caches/hooks"
import {
    getCards,
    getGameId,
    getGamePlayers,
    getIamDealer,
    getIsMyGo,
    getMaxCall,
    getRound,
} from "../../../caches/GameSlice"
import { useCallback, useMemo } from "react"
import { useSnackbar } from "notistack"
import parseError from "../../../utils/ErrorUtils"

const Calling = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()
    const gameId = useAppSelector(getGameId)
    const cards = useAppSelector(getCards)
    const round = useAppSelector(getRound)
    const players = useAppSelector(getGamePlayers)
    const isMyGo = useAppSelector(getIsMyGo)
    const iamDealer = useAppSelector(getIamDealer)
    const maxCall = useAppSelector(getMaxCall)

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

    const buttonsEnabled = useMemo(
        () => round && round.currentHand && cards.length > 0 && isMyGo,
        [round, cards, isMyGo],
    )

    const canCall10 = useMemo(
        () =>
            players.length === 6 &&
            ((iamDealer && maxCall <= 10) || maxCall < 10),
        [players, iamDealer, maxCall],
    )

    const canCall15 = useMemo(
        () => (iamDealer && maxCall <= 15) || maxCall < 15,
        [iamDealer, maxCall],
    )

    const canCall20 = useMemo(
        () => (iamDealer && maxCall <= 20) || maxCall < 20,
        [iamDealer, maxCall],
    )

    const canCall25 = useMemo(
        () => (iamDealer && maxCall <= 25) || maxCall < 25,
        [iamDealer, maxCall],
    )

    const canCallJink = useMemo(() => players.length > 2, [players])

    return (
        <>
            <Button
                disabled={!buttonsEnabled}
                type="button"
                color="secondary"
                onClick={() => call(0)}>
                Pass
            </Button>
            {canCall10 ? (
                <Button
                    disabled={!buttonsEnabled}
                    type="button"
                    color="primary"
                    onClick={() => call(10)}>
                    10
                </Button>
            ) : null}
            {canCall15 ? (
                <Button
                    disabled={!buttonsEnabled}
                    type="button"
                    color="warning"
                    onClick={() => call(15)}>
                    15
                </Button>
            ) : null}
            {canCall20 ? (
                <Button
                    disabled={!buttonsEnabled}
                    type="button"
                    color="warning"
                    onClick={() => call(20)}>
                    20
                </Button>
            ) : null}
            {canCall25 ? (
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
                {canCallJink ? "Jink" : "30"}
            </Button>
        </>
    )
}

export default Calling
