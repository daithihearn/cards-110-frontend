import MyCards from "./MyCards"
import PlayersAndCards from "./PlayersAndCards"

import ActionsWrapper from "./Actions/ActionsWrapper"
import { Card, styled } from "@mui/material"
import AutoActionManager from "./AutoActionManager"
import { useAppSelector } from "caches/hooks"
import { getIamSpectator } from "caches/GameSlice"

const GameCard = styled(Card)(({ theme }) => ({
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: "5px",
    borderRadius: "10px",
    borderColor:
        theme.palette.mode === "dark"
            ? theme.palette.grey[300]
            : theme.palette.grey[800],
    padding: "2px",
}))

const GameWrapper = () => {
    const iamSpectator = useAppSelector(getIamSpectator)

    return (
        <GameCard>
            <PlayersAndCards />

            {!iamSpectator ? <AutoActionManager /> : null}
            {!iamSpectator ? <ActionsWrapper /> : null}
            {!iamSpectator ? <MyCards /> : null}
        </GameCard>
    )
}

export default GameWrapper
