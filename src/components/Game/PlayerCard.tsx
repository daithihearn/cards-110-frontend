import { useMemo } from "react"
import { Col, CardImgOverlay, CardText, CardImg, Card } from "reactstrap"
import { getGamePlayers, getRound } from "../../caches/GameSlice"
import { useAppSelector } from "../../caches/hooks"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { BLANK_CARD } from "../../model/Cards"
import { PlayedCard } from "../../model/Game"

import { Player } from "../../model/Player"

interface PlayerRowI {
    player: Player
}
const PlayerCard: React.FC<PlayerRowI> = ({ player }) => {
    const round = useAppSelector(getRound)
    const players = useAppSelector(getGamePlayers)
    const playerProfiles = useAppSelector(getPlayerProfiles)

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

    if (!profile) return null

    return (
        <Col key={`playercard_col_${player.id}`} className="player-column">
            <Card className="card-transparent">
                <CardImg
                    alt={profile.name}
                    src={profile.picture}
                    className="img-center avatar"
                />
                <CardImgOverlay>
                    <CardText className="overlay-score">
                        {player.score}
                    </CardText>
                </CardImgOverlay>
            </Card>

            <Card className="card-transparent">
                {playedCard ? (
                    <CardImg
                        alt={profile.name}
                        src={`/cards/thumbnails/${playedCard.card}.png`}
                        className="img-center thumbnail_size"
                    />
                ) : (
                    <>
                        <CardImg
                            alt={profile.name}
                            src={`/cards/thumbnails/${
                                isCurrentPlayer ? "yellow" : "blank_grey"
                            }_back.png`}
                            className={`img-center thumbnail_size ${
                                isCurrentPlayer ? "" : "transparent"
                            }`}
                        />

                        {isDealer ? (
                            <CardImgOverlay>
                                <CardImg
                                    alt="Dealer Chip"
                                    src={"/cards/originals/DEALER.png"}
                                    className="thumbnail_chips overlay-dealer-chip"
                                />
                            </CardImgOverlay>
                        ) : null}

                        {round && !round.suit ? (
                            <CardImgOverlay>
                                {player.call === 10 ? (
                                    <CardImg
                                        alt="Ten Chip"
                                        src={"/cards/originals/call_10.png"}
                                        className="thumbnail_chips overlay-chip"
                                    />
                                ) : null}
                                {player.call === 15 ? (
                                    <CardImg
                                        alt="15 Chip"
                                        src={"/cards/originals/call_15.png"}
                                        className="thumbnail_chips overlay-chip"
                                    />
                                ) : null}
                                {player.call === 20 ? (
                                    <CardImg
                                        alt="20 Chip"
                                        src={"/cards/originals/call_20.png"}
                                        className="thumbnail_chips overlay-chip"
                                    />
                                ) : null}
                                {player.call === 25 ? (
                                    <CardImg
                                        alt="25 Chip"
                                        src={"/cards/originals/call_25.png"}
                                        className="thumbnail_chips overlay-chip"
                                    />
                                ) : null}
                                {player.call === 30 && players.length === 2 ? (
                                    <CardImg
                                        alt="30 Chip"
                                        src={"/cards/originals/call_30.png"}
                                        className="thumbnail_chips overlay-chip"
                                    />
                                ) : null}
                                {player.call === 30 && players.length > 2 ? (
                                    <CardImg
                                        alt="Jink Chip"
                                        src={"/cards/originals/call_jink.png"}
                                        className="thumbnail_chips overlay-chip"
                                    />
                                ) : null}
                            </CardImgOverlay>
                        ) : null}
                    </>
                )}
            </Card>
        </Col>
    )
}

export default PlayerCard
