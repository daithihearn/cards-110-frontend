import React, { useCallback, useMemo } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import TrophyImage from "../../assets/icons/trophy.png"
import { useAppSelector } from "../../caches/hooks"
import {
    getGamePlayers,
    getRound,
    getIsGameFinished,
} from "../../caches/GameSlice"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { compareScore, compareTeamIds } from "../../utils/PlayerUtils"
import { Player } from "../../model/Player"
import { customStyles } from "../Tables/CustomStyles"

interface LeaderBoardPlayer {
    cardsBought?: number
    name: string
    picture: string
    previousCard?: string
}

interface DoublesLeaderboardItem {
    teamId: string
    score: number
    rings: number
    player1: LeaderBoardPlayer
    player2: LeaderBoardPlayer
    winner: boolean
}

const DoublesLeaderboard = () => {
    const round = useAppSelector(getRound)
    const players = useAppSelector(getGamePlayers)
    const playerProfiles = useAppSelector(getPlayerProfiles)
    const isGameFinished = useAppSelector(getIsGameFinished)

    const previousHand = useMemo(() => {
        if (round) return round.completedHands[round.completedHands.length - 1]
    }, [round])

    const getProfile = useCallback(
        (player: Player) =>
            playerProfiles.find(p => p.id === player.id, [playerProfiles]),
        [playerProfiles],
    )

    const mapToLeaderboard = useCallback(
        (player: Player): LeaderBoardPlayer => {
            const profile = getProfile(player)
            if (!profile) throw Error("No profile for player")
            const previousCard = previousHand?.playedCards.find(
                c => c.playerId === player.id,
            )
            return {
                cardsBought: player.cardsBought,
                name: profile.name,
                picture: profile.picture,
                previousCard: previousCard?.card,
            }
        },
        [previousHand],
    )

    const leaderboardData = useMemo<DoublesLeaderboardItem[]>(() => {
        const ps = [...players].sort(compareTeamIds)

        if (!ps) {
            return []
        }
        const items: DoublesLeaderboardItem[] = [
            {
                teamId: ps[0].teamId,
                score: ps[0].score,
                rings: ps[0].rings,
                player1: mapToLeaderboard(ps[0]),
                player2: mapToLeaderboard(ps[1]),
                winner: ps[0].winner,
            },
            {
                teamId: ps[2].teamId,
                score: ps[2].score,
                rings: ps[2].rings,
                player1: mapToLeaderboard(ps[2]),
                player2: mapToLeaderboard(ps[3]),
                winner: ps[2].winner,
            },
            {
                teamId: ps[4].teamId,
                score: ps[4].score,
                rings: ps[4].rings,
                player1: mapToLeaderboard(ps[4]),
                player2: mapToLeaderboard(ps[5]),
                winner: ps[4].winner,
            },
        ]

        return items.sort(compareScore)
    }, [players])

    const columns: TableColumn<DoublesLeaderboardItem>[] = [
        {
            name: "Player 1",
            cell: row => (
                <>
                    <div>
                        <img
                            alt="Image Preview"
                            src={row.player1.picture}
                            className="avatar"
                        />

                        {!isGameFinished && !!row.player1.previousCard ? (
                            <div>
                                {previousHand ? (
                                    <img
                                        alt={row.player1.previousCard}
                                        src={
                                            "/cards/thumbnails/" +
                                            row.player1.previousCard +
                                            ".png"
                                        }
                                        className="thumbnail_size_small cardNotSelected"
                                    />
                                ) : null}
                            </div>
                        ) : null}

                        {!isGameFinished ? (
                            <div>
                                {!!row.player1.cardsBought
                                    ? `Bought: ${row.player1.cardsBought}`
                                    : ``}
                            </div>
                        ) : null}
                    </div>
                </>
            ),
        },
        {
            name: "Player 2",
            cell: row => (
                <div>
                    <img
                        alt="Image Preview"
                        src={row.player2.picture}
                        className="avatar"
                    />

                    {!isGameFinished && previousHand ? (
                        <div>
                            {previousHand ? (
                                <img
                                    alt={row.player2.previousCard}
                                    src={
                                        "/cards/thumbnails/" +
                                        row.player2.previousCard +
                                        ".png"
                                    }
                                    className="thumbnail_size_small cardNotSelected"
                                />
                            ) : null}
                        </div>
                    ) : null}

                    {!isGameFinished ? (
                        <div>
                            {!!row.player2.cardsBought
                                ? `Bought: ${row.player2.cardsBought}`
                                : ``}
                        </div>
                    ) : null}
                </div>
            ),
        },
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
            cell: row => (
                <div>
                    {row.winner ? (
                        <img src={TrophyImage} width="50px" height="50px" />
                    ) : null}
                </div>
            ),
            center: true,
            omit: !isGameFinished,
        },
    ]

    if (!playerProfiles || playerProfiles.length === 0) {
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
                customStyles={customStyles}
                defaultSortFieldId={3}
                defaultSortAsc={false}
            />
        </React.Fragment>
    )
}

export default DoublesLeaderboard
