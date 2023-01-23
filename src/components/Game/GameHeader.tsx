import { useMemo } from "react"

import { CardImg } from "reactstrap"
import { getGamePlayers, getRound } from "../../caches/GameSlice"
import { useAppSelector } from "../../caches/hooks"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { Player, PlayerProfile } from "../../model/Player"

interface PlayerAndProfile {
    player?: Player
    profile?: PlayerProfile
}

const GameHeader = () => {
    const round = useAppSelector(getRound)
    const players = useAppSelector(getGamePlayers)
    const playerProfiles = useAppSelector(getPlayerProfiles)

    const goer = useMemo<PlayerAndProfile>(() => {
        if (round && round.goerId) {
            const profile = playerProfiles.find(p => p.id === round.goerId)
            const player = players.find(p => p.id === round.goerId)

            return {
                profile,
                player,
            }
        }
        return {}
    }, [round, players, playerProfiles])

    return (
        <>
            {goer.profile && goer.player && (
                <div className="cardAreaHeader">
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

                    {round && round.suit && (
                        <CardImg
                            alt="Suit"
                            src={`/cards/originals/${round.suit}_ICON.svg`}
                            className="thumbnail_size_extra_small left-padding"
                        />
                    )}
                </div>
            )}
        </>
    )
}

export default GameHeader
