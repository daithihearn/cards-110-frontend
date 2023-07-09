import { useCallback, useEffect, useMemo, useState } from "react"

import GameService from "services/GameService"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import { getMyCardsWithoutBlanks, getSelectedCards } from "caches/MyCardsSlice"
import { getGameId, getIsMyGo, getRound } from "caches/GameSlice"
import { BLANK_CARD } from "model/Cards"
import parseError from "utils/ErrorUtils"
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

type AutoPlayState = "off" | "best" | "worst"

const PlayCard = () => {
    const dispatch = useAppDispatch()
    const theme = useTheme()
    const round = useAppSelector(getRound)
    const [autoPlay, setAutoPlay] = useState<AutoPlayState>("off")
    const gameId = useAppSelector(getGameId)
    const myCards = useAppSelector(getMyCardsWithoutBlanks)
    const isMyGo = useAppSelector(getIsMyGo)
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
                myCards.filter(c => c.name !== BLANK_CARD.name).length ===
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

    const playCard = useCallback(
        (card: string) =>
            dispatch(GameService.playCard(gameId!, card)).catch(e => {
                console.error(parseError(e))
            }),
        [gameId],
    )

    const selectCardToPlay = useCallback(() => {
        if (selectedCards.length === 1)
            dispatch(updateCardToPlay(selectedCards[0]))
    }, [selectedCards])

    // 1. Play card when you've pre-selected a card
    // 2. If best card lead or lead from bottom enabled, play worst card
    // 3. If lead from the top enabled, play best card
    useEffect(() => {
        if (round?.suit && isMyGo) {
            if (cardToPlay) playCard(cardToPlay)
            else if (autoPlay === "best" || bestCardLead(round)) {
                const worstCard = getWorstCard(myCards, round.suit)
                playCard(worstCard.name)
            } else if (autoPlay === "worst") {
                const bestCard = getBestCard(myCards, round.suit)
                playCard(bestCard.name)
            }
        }
    }, [playCard, autoPlay, round, isMyGo, myCards, cardToPlay])

    return (
        <ButtonGroup disableElevation variant="contained" size="large">
            <PlayCardButton />
            <AutoPlayDropdown />
        </ButtonGroup>
    )
}

export default PlayCard
