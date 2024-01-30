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
import { PlayedCard } from "model/Game"
import { Player, PlayerProfile } from "model/Player"
import Leaderboard from "components/Leaderboard/Leaderboard"
import { Suit } from "model/Suit"
import { FormatName } from "utils/FormattingUtils"
import { useAppSelector } from "caches/hooks"
import { getGame, getIsRoundPlaying, getRound } from "caches/GameSlice"
import { Event } from "model/Events"

interface PlayerRowI {
    player: Player
    profile: PlayerProfile
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
            className="img-center thumbnail-size"
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

const SuitChip: React.FC<{ isGoer: boolean }> = ({ isGoer }) => {
    const round = useAppSelector(getRound)

    const suitChip = useMemo(() => {
        if (!round?.suit) return undefined
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
    isGoer: boolean
}> = ({ call, isGoer }) => {
    const isRoundPlaying = useAppSelector(getIsRoundPlaying)
    const callChip = useMemo(() => {
        if (isRoundPlaying && !isGoer) return undefined
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
    }, [call])

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

const DealerChip: React.FC<{
    player: Player
    dealerId?: string
}> = ({ player, dealerId }) => {
    const isDealer: boolean = useMemo(
        () => dealerId === player.id,
        [dealerId, player],
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

const PlayerCard: React.FC<PlayerRowI> = ({ player, profile, className }) => {
    const theme = useTheme()
    const game = useAppSelector(getGame)
    const [revisionActioned, setRevisionActioned] = useState(-1)
    const [playedCard, setPlayedCard] = useState<PlayedCard | undefined>(
        undefined,
    )
    const [modalLeaderboard, setModalLeaderboard] = useState(false)

    const toggleLeaderboardModal = useCallback(
        () => setModalLeaderboard(!modalLeaderboard),
        [modalLeaderboard],
    )

    const isGoer: boolean = useMemo(
        () => !!game.round && game.round.goerId === player.id,
        [game.round, player],
    )

    const delayResetCard = useCallback(() => {
        // The in 3 seconds set it back to undefined
        setTimeout(() => {
            setPlayedCard(undefined)
        }, 3000)
    }, [])

    useEffect(() => {
        if (game.round && game.revision > revisionActioned) {
            if (game.event === Event.HandEnd) {
                // Set card from the last hand
                setPlayedCard(
                    game.round.completedHands
                        .toReversed()[0]
                        ?.playedCards?.find(c => c.playerId === player.id),
                )
                delayResetCard()
            } else if (game.event === Event.RoundEnd) {
                // Set card from the previous round
                if (game.previousRound) {
                    setPlayedCard(
                        game.previousRound.completedHands
                            .toReversed()[0]
                            ?.playedCards?.find(c => c.playerId === player.id),
                    )
                }
                delayResetCard()
            } else {
                setPlayedCard(
                    game.round.currentHand.playedCards?.find(
                        c => c.playerId === player.id,
                    ),
                )
            }
            setRevisionActioned(game.revision)
        }
    }, [game, player, delayResetCard, revisionActioned])

    const isCurrentPlayer: boolean = useMemo(
        () =>
            !!game.round &&
            game.round.currentHand.currentPlayerId === player.id,
        [game.round, player],
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
        <Grid
            item
            key={`playercard_col_${player.id}`}
            xs={12}
            className={
                isCurrentPlayer ? "highlight-player-" + theme.palette.mode : ""
            }>
            <Card className="no-shadow">
                <CardContent className="player-name-container">
                    <Typography
                        variant="h4"
                        component="h4"
                        className="score-text bg-dark text-light">
                        {FormatName(profile.name, 7)}
                    </Typography>
                </CardContent>

                <CardMedia
                    image={profile.picture}
                    onClick={toggleLeaderboardModal}
                    className={`img-center player-avatar ${className} ${
                        !isCurrentPlayer && "dull-player"
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
                        className="img-center thumbnail-size"
                    />
                ) : (
                    <Card>
                        <Stack position="relative">
                            <BlankCard name={profile.name} />
                            <DealerChip
                                player={player}
                                dealerId={game.round?.dealerId}
                            />
                            <CallChip call={player.call} isGoer={isGoer} />
                            <SuitChip isGoer={isGoer} />
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
