import { useCallback, useMemo, useState } from "react"
import {
    Col,
    CardImgOverlay,
    CardText,
    CardImg,
    Card,
    CardSubtitle,
    Modal,
    ModalBody,
    CardGroup,
    CardHeader,
    CardBody,
} from "reactstrap"
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
        if (player.score < 30) {
            return "bg-dark text-light"
        } else if (player.score < 30) {
            return "bg-secondary text-light"
        } else if (player.score <= 65) {
            return "bg-primary text-light"
        } else if (player.score <= 90) {
            return "bg-warning text-dark"
        } else if (player.score <= 105) {
            return "bg-danger text-dark"
        } else {
            return "bg-success text-light"
        }
    }, [player.score])

    if (!profile) return null

    return (
        <Col key={`playercard_col_${player.id}`} className="player-column">
            <Card
                className="card-transparent clickable"
                onClick={toggleLeaderboardModal}>
                <CardImg
                    alt={profile.name}
                    src={profile.picture}
                    top={true}
                    className={`img-center player-avatar ${className}`}
                />
                <CardSubtitle className="player-score-container">
                    <CardText className="player-score">
                        <div className={`score-text ${scoreClassName}`}>
                            {player.score}
                        </div>
                    </CardText>
                </CardSubtitle>
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
                                isCurrentPlayer
                                    ? "yellow_back.png"
                                    : "blank_card_outline.png"
                            }`}
                            className={`img-center thumbnail_size`}
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

            <Modal
                fade={true}
                size="lg"
                toggle={toggleLeaderboardModal}
                isOpen={modalLeaderboard}>
                <ModalBody className="gameModalBody">
                    <CardGroup>
                        <Card className="data-card">
                            <CardHeader tag="h2">Leaderboard</CardHeader>
                            <CardBody>
                                <Leaderboard />
                            </CardBody>
                        </Card>
                    </CardGroup>
                </ModalBody>
            </Modal>
        </Col>
    )
}

export default PlayerCard
