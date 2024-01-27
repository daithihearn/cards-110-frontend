import { useCallback, useEffect, useMemo, useState } from "react"

import { useAppDispatch, useAppSelector } from "caches/hooks"
import { getMyCardsWithoutBlanks, getSelectedCards } from "caches/MyCardsSlice"
import { getGameId, getIsMyGo, getRound } from "caches/GameSlice"
import { RoundStatus } from "model/Round"
import {
    Button,
    ButtonGroup,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    useTheme,
} from "@mui/material"
import { getCardToPlay, updateCardToPlay } from "caches/PlayCardSlice"
import { bestCardLead, getBestCard, getWorstCard } from "utils/GameUtils"
import { CARDS, CardName } from "model/Cards"
import { useGameActions } from "components/Hooks/useGameActions"

type AutoPlayState = "off" | "best" | "worst"

const PlayCard = () => {
    const dispatch = useAppDispatch()
    const theme = useTheme()
    const { playCard } = useGameActions()
    const round = useAppSelector(getRound)
    const gameId = useAppSelector(getGameId)
    const myCards = useAppSelector(getMyCardsWithoutBlanks)
    const isMyGo = useAppSelector(getIsMyGo)

    const [autoPlay, setAutoPlay] = useState<AutoPlayState>("off")
    const selectedCards = useAppSelector(getSelectedCards)
    const cardToPlay = useAppSelector(getCardToPlay)

    const handleAutoPlayChange = useCallback(
        (event: SelectChangeEvent<AutoPlayState>) => {
            const value = event.target.value as AutoPlayState
            setAutoPlay(value)
        },
        [],
    )

    const AutoPlayDropdown = () => (
        <FormControl variant="filled" sx={{ minWidth: 90 }}>
            <InputLabel id="autoplay-select-label">Autoplay</InputLabel>
            <Select
                labelId="autoplay-select-label"
                label="Autoplay"
                value={autoPlay}
                onChange={handleAutoPlayChange}
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                    },
                    "& .MuiSelect-select:focus": {
                        backgroundColor: theme.palette.primary.main,
                    },
                    "& .MuiSelect-icon": {
                        color: theme.palette.primary.contrastText,
                    },
                }}>
                <MenuItem value="off">Off</MenuItem>
                <MenuItem value="best">Best</MenuItem>
                <MenuItem value="worst">Worst</MenuItem>
            </Select>
        </FormControl>
    )

    const playButtonEnabled = useMemo(
        () =>
            isMyGo &&
            round &&
            round.status === RoundStatus.PLAYING &&
            round.completedHands.length +
                myCards.filter(c => c.name !== CardName.EMPTY).length ===
                5,

        [isMyGo, round, myCards],
    )

    const PlayCardButton = () => (
        <Button
            id="playCardButton"
            type="button"
            disabled={!playButtonEnabled}
            onClick={selectCardToPlay}
            color="warning">
            <b>Play Card</b>
        </Button>
    )

    const selectCardToPlay = useCallback(() => {
        if (selectedCards.length === 1 && gameId)
            playCard({ gameId, card: selectedCards[0].name })
    }, [gameId, selectedCards])

    return (
        <ButtonGroup disableElevation variant="contained" size="large">
            <PlayCardButton />
            <AutoPlayDropdown />
        </ButtonGroup>
    )
}

export default PlayCard
