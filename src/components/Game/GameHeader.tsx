import { useMemo } from "react"

import { CardImg } from "reactstrap"
import { getGame } from "../../caches/GameSlice"
import { useAppSelector } from "../../caches/hooks"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { Player, PlayerProfile } from "../../model/Player"

interface PlayerAndProfile {
  player?: Player
  profile?: PlayerProfile
}

const GameHeader = () => {
  const playerProfiles = useAppSelector(getPlayerProfiles)
  const game = useAppSelector(getGame)

  const goer = useMemo<PlayerAndProfile>(() => {
    if (game.round && game.round.goerId) {
      const profile = playerProfiles.find((p) => p.id === game.round?.goerId)
      const player = game.players.find((p) => p.id === game.round?.goerId)

      return {
        profile,
        player,
      }
    }
    return {}
  }, [game, playerProfiles])

  return (
    <>
      {goer.profile && goer.player && (
        <>
          <h2 className="cardAreaHeader">
            <CardImg
              alt={goer.profile.name}
              src={goer.profile.picture}
              className="thumbnail_size_extra_small"
            />

            {goer.player.call && (
              <CardImg
                alt="Chip"
                src={`/cards/originals/call_${goer.player.call}.png`}
                className="thumbnail_size_extra_small left-padding"
              />
            )}

            {game.round && game.round.suit && (
              <CardImg
                alt="Suit"
                src={`/cards/originals/${game.round.suit}_ICON.svg`}
                className="thumbnail_size_extra_small left-padding"
              />
            )}
          </h2>
        </>
      )}
    </>
  )
}

export default GameHeader
