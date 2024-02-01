import { useCallback, useEffect, useMemo, useState } from "react"

import { useAppSelector } from "caches/hooks"
import { getGame, getSelectedCards } from "caches/GameSlice"
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
import { CardName } from "model/Cards"
import { useGameActions } from "components/Hooks/useGameActions"
import { bestCardLead, getBestCard, getWorstCard } from "utils/GameUtils"

type AutoPlayState = "off" | "best" | "worst"

const PlayCard = () => {
    const theme = useTheme()
    const { playCard } = useGameActions()
    const game = useAppSelector(getGame)

    const [autoPlay, setAutoPlay] = useState<AutoPlayState>("off")
    const selectedCards = useAppSelector(getSelectedCards)

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
            game.isMyGo &&
            game.round?.status === RoundStatus.PLAYING &&
            game.round.completedHands.length +
                game.cardsFull.filter(c => c.name !== CardName.EMPTY).length ===
                5,

        [game],
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
        if (selectedCards.length === 1 && game.id)
            playCard({ gameId: game.id, card: selectedCards[0].name })
    }, [game.id, selectedCards])

    // Auto play logic
    // 1. If best card lead or lead from bottom enabled, play worst card
    // 2. If lead from the top enabled, play best card
    useEffect(() => {
        if (game.id && game.round?.suit && game.isMyGo) {
            if (autoPlay === "worst" || bestCardLead(game.round)) {
                const worstCard = getWorstCard(game.cardsFull, game.round)
                if (worstCard)
                    playCard({ gameId: game.id, card: worstCard.name })
            } else if (autoPlay === "best") {
                const bestCard = getBestCard(game.cardsFull, game.round)
                if (bestCard) playCard({ gameId: game.id, card: bestCard.name })
            }
        }
    }, [playCard, autoPlay, game])

    return (
        <ButtonGroup disableElevation variant="contained" size="large">
            <PlayCardButton />
            <AutoPlayDropdown />
        </ButtonGroup>
    )
}

export default PlayCard
