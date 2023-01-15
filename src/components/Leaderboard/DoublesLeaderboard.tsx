import React, { useCallback, useMemo } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import TrophyImage from "../../assets/icons/trophy.png"
import { useAppSelector } from "../../caches/hooks"
import { getGame } from "../../caches/GameSlice"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { GameStatus } from "../../model/Game"
import { compareScore, compareTeamIds } from "../../utils/PlayerUtils"
import { Player, Team } from "../../model/Player"
import { customStyles } from "../Tables/CustomStyles"

const DoublesLeaderboard = () => {
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

    const teams = useMemo<Team[]>(() => {
        const ps = game.players.sort(compareTeamIds)

        if (!ps) {
            return []
        }
        const teams: Team[] = [
            {
                id: ps[0].teamId,
                score: ps[0].score,
                rings: ps[0].rings,
                player1: ps[0],
                player2: ps[1],
                winner: ps[0].winner,
            },
            {
                id: ps[2].teamId,
                score: ps[2].score,
                rings: ps[2].rings,
                player1: ps[2],
                player2: ps[3],
                winner: ps[2].winner,
            },
            {
                id: ps[4].teamId,
                score: ps[4].score,
                rings: ps[4].rings,
                player1: ps[4],
                player2: ps[5],
                winner: ps[4].winner,
            },
        ]

        return teams.sort(compareScore)
    }, [])

    const columns: TableColumn<Team>[] = [
        {
            name: "Player 1",
            cell: row => (
                <>
                    <div>
                        <img
                            alt="Image Preview"
                            src={getProfile(row.player1)!.picture}
                            className="avatar"
                        />

                        {!gameOver && !!previousHand ? (
                            <div>
                                {previousHand ? (
                                    <img
                                        alt={
                                            previousHand.playedCards.find(
                                                p =>
                                                    p.playerId ===
                                                    row.player1.id,
                                            )?.card
                                        }
                                        src={
                                            "/cards/thumbnails/" +
                                            previousHand.playedCards.find(
                                                p =>
                                                    p.playerId ===
                                                    row.player1.id,
                                            )?.card +
                                            ".png"
                                        }
                                        className="thumbnail_size_small cardNotSelected"
                                    />
                                ) : null}
                            </div>
                        ) : null}

                        {!gameOver ? (
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
                        src={getProfile(row.player2)!.picture}
                        className="avatar"
                    />

                    {!gameOver && previousHand ? (
                        <div>
                            {previousHand ? (
                                <img
                                    alt={
                                        previousHand.playedCards.find(
                                            p => p.playerId === row.player2.id,
                                        )?.card
                                    }
                                    src={
                                        "/cards/thumbnails/" +
                                        previousHand.playedCards.find(
                                            p => p.playerId === row.player1.id,
                                        )?.card +
                                        ".png"
                                    }
                                    className="thumbnail_size_small cardNotSelected"
                                />
                            ) : null}
                        </div>
                    ) : null}

                    {!gameOver ? (
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
            omit: !gameOver,
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
                data={teams}
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
