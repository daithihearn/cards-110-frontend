import React, { useCallback, useMemo } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import TrophyImage from "../../assets/icons/trophy.png"
import { getGame } from "../../caches/GameSlice"
import { useAppSelector } from "../../caches/hooks"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { GameStatus } from "../../model/Game"
import { Player } from "../../model/Player"

interface LeaderboardItem {
    previousCard?: string
    score: number
    rings: number
    winner: boolean
    cardsBought: number
    name: string
    picture: string
}

const SinglesLeaderboard = () => {
    const game = useAppSelector(getGame)
    const playerProfiles = useAppSelector(getPlayerProfiles)

    const previousHand = useMemo(() => {
        if (game.round)
            return game.round.completedHands[
                game.round.completedHands.length - 1
            ]
    }, [game])

    const gameOver = useMemo(() => game.status === GameStatus.FINISHED, [game])

    const getProfile = useCallback(
        (player: Player) =>
            playerProfiles.find(p => p.id === player.id, [playerProfiles]),
        [playerProfiles],
    )

    const leaderboardData = useMemo<LeaderboardItem[]>(() => {
        const leaderboardData: LeaderboardItem[] = []

        game.players.forEach(player => {
            const profile = getProfile(player)
            if (!profile) {
                return null
            }
            leaderboardData.push({
                picture: profile.picture,
                name: profile.name,
                score: player.score,
                cardsBought: player.cardsBought || 0,
                previousCard: previousHand
                    ? previousHand.playedCards.find(
                          p => p.playerId === profile.id,
                      )?.card
                    : undefined,
                rings: player.rings,
                winner: player.winner,
            })
        })
        return leaderboardData
    }, [playerProfiles, game, getProfile, previousHand])

    const columns: TableColumn<LeaderboardItem>[] = [
        {
            name: "Avatar",
            cell: row => (
                <img alt="Image Preview" src={row.picture} className="avatar" />
            ),
        },
        { name: "Player", selector: row => row.name, sortable: true },
        {
            name: "Score",
            selector: row => row.score,
            sortable: true,
            center: true,
        },
        {
            name: "Rings",
            selector: row => row.rings,
            sortable: true,
            center: true,
        },
        {
            name: "Bought",
            selector: row => row.cardsBought,
            sortable: true,
            center: true,
            omit: gameOver,
        },
        {
            cell: row => (
                <div>
                    {row.winner ? (
                        <img src={TrophyImage} width="50px" height="50px" />
                    ) : null}
                </div>
            ),
            center: true,
            omit: !gameOver,
        },
        {
            cell: row => (
                <img
                    alt={row.previousCard}
                    src={"/cards/thumbnails/" + row.previousCard + ".png"}
                    className="thumbnail_size_small cardNotSelected"
                />
            ),
            center: true,
            omit: gameOver || !previousHand,
        },
    ]

    if (
        !game ||
        !game.status ||
        !playerProfiles ||
        playerProfiles.length === 0
    ) {
        return null
    }

    return (
        <React.Fragment>
            <DataTable
                noHeader
                theme="solarized"
                data={leaderboardData}
                columns={columns}
                highlightOnHover
                defaultSortFieldId={3}
                defaultSortAsc={false}
            />
        </React.Fragment>
    )
}

export default SinglesLeaderboard
