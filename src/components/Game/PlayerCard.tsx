import { useCallback, useMemo, useState } from "react"
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
} from "@mui/material"
import { styled } from "@mui/system"
import { getGamePlayers, getRound } from "caches/GameSlice"
import { useAppSelector } from "caches/hooks"
import { getPlayerProfiles } from "caches/PlayerProfilesSlice"
import { BLANK_CARD } from "model/Cards"
import { PlayedCard } from "model/Game"
import { Player } from "model/Player"
import Leaderboard from "components/Leaderboard/Leaderboard"

interface PlayerRowI {
    player: Player
    className?: string
}

const Card = styled(MuiCard)({
    background: "transparent",
})

const CardMediaClickable = styled(CardMedia)({
    cursor: "pointer",
})

const PlayerCard: React.FC<PlayerRowI> = ({ player, className }) => {
    const round = useAppSelector(getRound)
    const players = useAppSelector(getGamePlayers)
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

    const isDealer: boolean = useMemo(
        () => !!round && !round.suit && round.dealerId === player.id,
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
        <Grid
            item
            key={`playercard_col_${player.id}`}
            className="player-column">
            <Card className="no-shadow">
                <CardMediaClickable
                    image={profile.picture}
                    onClick={toggleLeaderboardModal}
                    className={`img-center player-avatar ${className}`}
                />
                <CardContent className="player-score-container">
                    <Typography
                        component="span"
                        className={`player-score score-text ${scoreClassName}`}>
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
                            <CardMedia
                                component="img"
                                alt={profile.name}
                                image={`/cards/thumbnails/${
                                    isCurrentPlayer
                                        ? "yellow_back.png"
                                        : "blank_card_outline.png"
                                }`}
                                className={`img-center thumbnail_size`}
                            />

                            {isDealer && (
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    width={"100%"}>
                                    <CardMedia
                                        component="img"
                                        alt="Dealer Chip"
                                        image={"/cards/originals/DEALER.png"}
                                        className="img-center thumbnail_chips overlay-dealer-chip"
                                    />
                                </Box>
                            )}

                            {round && !round.suit && (
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    width={"100%"}>
                                    {player.call === 10 && (
                                        <CardMedia
                                            component="img"
                                            alt="Ten Chip"
                                            image={
                                                "/cards/originals/call_10.png"
                                            }
                                            className="img-center thumbnail_chips overlay-chip"
                                        />
                                    )}
                                    {player.call === 15 && (
                                        <CardMedia
                                            component="img"
                                            alt="15 Chip"
                                            image={
                                                "/cards/originals/call_15.png"
                                            }
                                            className="img-center thumbnail_chips overlay-chip"
                                        />
                                    )}
                                    {player.call === 20 && (
                                        <CardMedia
                                            component="img"
                                            alt="20 Chip"
                                            image={
                                                "/cards/originals/call_20.png"
                                            }
                                            className="img-center thumbnail_chips overlay-chip"
                                        />
                                    )}
                                    {player.call === 25 && (
                                        <CardMedia
                                            component="img"
                                            alt="25 Chip"
                                            image={
                                                "/cards/originals/call_25.png"
                                            }
                                            className="img-center thumbnail_chips overlay-chip"
                                        />
                                    )}
                                    {player.call === 30 &&
                                        players.length === 2 && (
                                            <CardMedia
                                                component="img"
                                                alt="30 Chip"
                                                image={
                                                    "/cards/originals/call_30.png"
                                                }
                                                className="img-center thumbnail_chips overlay-chip"
                                            />
                                        )}
                                    {player.call === 30 &&
                                        players.length > 2 && (
                                            <CardMedia
                                                component="img"
                                                alt="Jink Chip"
                                                image={
                                                    "/cards/originals/call_jink.png"
                                                }
                                                className="img-center thumbnail_chips overlay-chip"
                                            />
                                        )}
                                </Box>
                            )}
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
