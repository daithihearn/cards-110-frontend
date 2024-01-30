import { useEffect } from "react"

import { useAppSelector } from "caches/hooks"
import { getGame, getIsInBunker } from "caches/GameSlice"
import { useGameActions } from "components/Hooks/useGameActions"
import { RoundStatus } from "model/Round"
import { useSettings } from "components/Hooks/useSettings"
import { pickBestCards } from "utils/GameUtils"

const AutoActionManager = () => {
    const { call, buyCards } = useGameActions()
    const { settings } = useSettings()
    const game = useAppSelector(getGame)
    const isInBunker = useAppSelector(getIsInBunker)

    useEffect(() => {
        if (game.id && game.isMyGo) {
            // Card Buying
            if (game.round?.status === RoundStatus.BUYING) {
                if (game.iamGoer) {
                    buyCards({ gameId: game.id, cards: game.cards })
                } else if (settings?.autoBuyCards && game.round?.suit) {
                    buyCards({
                        gameId: game.id,
                        cards: pickBestCards(
                            game.cards,
                            game.round.suit,
                            game.players.length,
                        ),
                    })
                }
            }

            if (game.id && isInBunker) call({ gameId: game.id, call: "0" })
        }
    }, [game, settings, isInBunker])

    return null
}

export default AutoActionManager
