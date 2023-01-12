import { useEffect, useMemo, useState } from "react"
import { Col, CardImgOverlay, CardText, CardImg } from "reactstrap"
import { getGame } from "../../caches/GameSlice"
import { useAppSelector } from "../../caches/hooks"
import { Card } from "../../model/Cards"

import { Player, PlayerProfile } from "../../model/Player"

interface PlayerRowI {
  player: Player
  profile?: PlayerProfile
}
const PlayerCard: React.FC<PlayerRowI> = ({ player, profile }) => {
  const game = useAppSelector(getGame)

  const playedCard = useMemo(() => {
    if (game.round) {
      return game.round.currentHand.playedCards[player.id]
    }
  }, [game])

  const isCurrentPlayer: boolean = useMemo(
    () => !!game.round && game.round.currentHand.currentPlayerId === player.id,
    [game]
  )

  const isDealer: boolean = useMemo(
    () => !!game.round && !game.round.suit && game.round.dealerId === player.id,
    [game]
  )

  if (!profile || !game.round) return null
  return (
    <Col key={`playercard_col_${player.id}`} className="player-column">
      <div>
        <CardImg alt={profile.name} src={profile.picture} className="avatar" />
        <CardImgOverlay>
          <CardText className="overlay-score">{player.score}</CardText>
        </CardImgOverlay>
      </div>

      <div>
        {playedCard ? (
          <CardImg
            alt={profile.name}
            src={`/cards/thumbnails/${playedCard}.png`}
            className="thumbnail_size"
          />
        ) : (
          <a>
            <CardImg
              alt={profile.name}
              src={`/cards/thumbnails/${
                isCurrentPlayer ? "yellow" : "blank_grey"
              }_back.png`}
              className={`thumbnail_size ${
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

            {!game.round.suit ? (
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
                {player.call === 30 && game.players.length === 2 ? (
                  <CardImg
                    alt="30 Chip"
                    src={"/cards/originals/call_30.png"}
                    className="thumbnail_chips overlay-chip"
                  />
                ) : null}
                {player.call === 30 && game.players.length > 2 ? (
                  <CardImg
                    alt="Jink Chip"
                    src={"/cards/originals/call_jink.png"}
                    className="thumbnail_chips overlay-chip"
                  />
                ) : null}
              </CardImgOverlay>
            ) : null}
          </a>
        )}
      </div>

      <div></div>
    </Col>
  )
}

export default PlayerCard
