import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
    Grid,
    CardMedia,
    Typography,
    Card as MuiCard,
    CardContent,
    Dialog,
    DialogContent,
    Stack,
    Box,
    useTheme,
} from "@mui/material"
import { styled } from "@mui/system"
import { getGamePlayers, getRound } from "caches/GameSlice"
import { useAppSelector } from "caches/hooks"
import { getPlayerProfiles } from "caches/PlayerProfilesSlice"
import { BLANK_CARD } from "model/Cards"
import { PlayedCard } from "model/Game"
import { Player } from "model/Player"
import Leaderboard from "components/Leaderboard/Leaderboard"
import { Suit } from "model/Suit"

interface PlayerRowI {
    player: Player
    className?: string
}

const Card = styled(MuiCard)({
    background: "transparent",
})

const BlankCard: React.FC<{ name: string }> = ({ name }) => {
    const theme = useTheme()

    return (
        <CardMedia
            component="img"
            alt={name}
            image={
                theme.palette.mode === "dark"
                    ? "/cards/thumbnails/blank_card_outline_light.png"
                    : "/cards/thumbnails/blank_card_outline_dark.png"
            }
            className="img-center thumbnail_size"
        />
    )
}

enum ChipType {
    Dealer = "DEALER.png",
    Call10 = "call_10.png",
    Call15 = "call_15.png",
    Call20 = "call_20.png",
    Call25 = "call_25.png",
    CallJink = "call_jink.png",
    Clubs = "CLUBS_ICON.svg",
    Diamonds = "DIAMONDS_ICON.svg",
    Hearts = "HEARTS_ICON.svg",
    Spades = "SPADES_ICON.svg",
}

const SuitChip: React.FC<{ player: Player }> = ({ player }) => {
    const round = useAppSelector(getRound)

    const isGoer: boolean = useMemo(
        () => !!round && round.goerId === player.id,
        [round, player],
    )

    const suitChip = useMemo(() => {
        if (!round || !round.suit) return undefined
        switch (round.suit) {
            case Suit.CLUBS:
                return ChipType.Clubs
            case Suit.DIAMONDS:
                return ChipType.Diamonds
            case Suit.HEARTS:
                return ChipType.Hearts
            case Suit.SPADES:
                return ChipType.Spades
            default:
                return undefined
        }
    }, [round])

    if (!isGoer || !suitChip) return null
    return (
        <Box position="absolute" top={0} left={0} width={"100%"}>
            <CardMedia
                component="img"
                alt="Suit Chip"
                image={`/cards/originals/${suitChip}`}
                className="img-center thumbnail-suit overlay-suit-chip"
            />
        </Box>
    )
}

const CallChip: React.FC<{
    call: number
}> = ({ call }) => {
    const round = useAppSelector(getRound)

    const callChip = useMemo(() => {
        if (!round || round.suit) return undefined
        switch (call) {
            case 10:
                return ChipType.Call10
            case 15:
                return ChipType.Call15
            case 20:
                return ChipType.Call20
            case 25:
                return ChipType.Call25
            case 30:
                return ChipType.CallJink
            default:
                return undefined
        }
    }, [round, call])

    if (!callChip) return null
    return (
        <Box position="absolute" top={0} left={0} width={"100%"}>
            <CardMedia
                component="img"
                alt="Call Chip"
                image={`/cards/thumbnails/${callChip}`}
                className="img-center thumbnail-chips overlay-chip"
            />
        </Box>
    )
}

const DealerChip: React.FC<{ player: Player }> = ({ player }) => {
    const round = useAppSelector(getRound)

    const isDealer: boolean = useMemo(
        () => !!round && !round.suit && round.dealerId === player.id,
        [round, player],
    )

    if (!isDealer) return null
    return (
        <Box position="absolute" top={0} left={0} width={"100%"}>
            <CardMedia
                component="img"
                alt="Dealer Chip"
                image={`/cards/thumbnails/${ChipType.Dealer}`}
                className="img-center thumbnail-chips overlay-dealer-chip"
            />
        </Box>
    )
}

const PlayerCard: React.FC<PlayerRowI> = ({ player, className }) => {
    const theme = useTheme()
    const round = useAppSelector(getRound)
    const playerProfiles = useAppSelector(getPlayerProfiles)
    const [modalLeaderboard, updateModalLeaderboard] = useState(false)

    const toggleLeaderboardModal = useCallback(
        () => updateModalLeaderboard(!modalLeaderboard),
        [modalLeaderboard],
    )

    const profile = useMemo(
        () => playerProfiles.find(p => p.id === player.id),
        [playerProfiles],
    )

    const playedCard = useMemo<PlayedCard | undefined>(() => {
        if (round) {
            return round.currentHand.playedCards.find(
                c => c.playerId === player.id,
            )
        }
        return { card: BLANK_CARD.name, playerId: player.id }
    }, [round, player])

    const isCurrentPlayer: boolean = useMemo(
        () => !!round && round.currentHand.currentPlayerId === player.id,
        [round, player],
    )

    const scoreClassName = useMemo(() => {
        if (player.score < -30) {
            return "bg-dark text-light"
        } else if (player.score < 0) {
            return "bg-secondary text-light"
        } else if (player.score <= 75) {
            return "bg-primary text-light"
        } else if (player.score <= 90) {
            return "bg-warning text-light"
        } else if (player.score <= 105) {
            return "bg-danger text-light"
        } else {
            return "bg-success text-light"
        }
    }, [player.score])

    if (!profile) return null

    return (
        <Grid item key={`playercard_col_${player.id}`} xs={12}>
            <Card className="no-shadow">
                <CardMedia
                    image={profile.picture}
                    onClick={toggleLeaderboardModal}
                    className={`img-center player-avatar ${className}  ${
                        isCurrentPlayer
                            ? "highlight-player-" + theme.palette.mode
                            : "dull-player"
                    }`}
                    sx={{ cursor: "pointer" }}
                />
                <CardContent className="player-score-container">
                    <Typography
                        variant="h3"
                        component="h3"
                        className={`score-text ${scoreClassName}`}>
                        {player.score}
                    </Typography>
                </CardContent>
            </Card>

            <Card className="no-shadow">
                {playedCard ? (
                    <CardMedia
                        component="img"
                        alt={profile.name}
                        image={`/cards/thumbnails/${playedCard.card}.png`}
                        className="img-center thumbnail_size"
                    />
                ) : (
                    <Card>
                        <Stack position="relative">
                            <BlankCard name={profile.name} />
                            <DealerChip player={player} />
                            <CallChip call={player.call} />
                            <SuitChip player={player} />
                        </Stack>
                    </Card>
                )}
            </Card>

            <Dialog
                onClose={toggleLeaderboardModal}
                open={modalLeaderboard}
                maxWidth="xl">
                <DialogContent>
                    <Grid container>
                        <Leaderboard />
                    </Grid>
                </DialogContent>
            </Dialog>
        </Grid>
    )
}

export default PlayerCard
