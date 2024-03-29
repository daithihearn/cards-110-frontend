import { ButtonGroup as MuiButtonGroup, CardContent } from "@mui/material"
import {
    getIsRoundBuying,
    getIsRoundCalled,
    getIsRoundCalling,
    getIsRoundPlaying,
} from "caches/GameSlice"
import { useAppSelector } from "caches/hooks"
import Buying from "./Buying"
import Calling from "./Calling"
import PlayCard from "./PlayCard"
import SelectSuit from "./SelectSuit"

const ActionsWrapper = () => {
    const isBuying = useAppSelector(getIsRoundBuying)
    const isCalling = useAppSelector(getIsRoundCalling)
    const isPlaying = useAppSelector(getIsRoundPlaying)
    const isCalled = useAppSelector(getIsRoundCalled)

    return (
        <CardContent className="button-area">
            <MuiButtonGroup
                size="large"
                variant="contained"
                sx={{ maxWidth: "100%" }}>
                {isCalling && <Calling />}
                {isBuying && <Buying />}
                {isCalled && <SelectSuit />}
                {isPlaying && <PlayCard />}
            </MuiButtonGroup>
        </CardContent>
    )
}

export default ActionsWrapper
