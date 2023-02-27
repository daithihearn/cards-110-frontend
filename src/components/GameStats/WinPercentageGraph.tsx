import React, { useEffect, useMemo, useState } from "react"
import { PlayerGameStats, PlayerProfile } from "../../model/Player"
import { Doughnut } from "react-chartjs-2"
import "chart.js/auto"
import { ChartOptions } from "chart.js"
import { useAppDispatch } from "../../caches/hooks"
import { useSnackbar } from "notistack"
import StatsService from "../../services/StatsService"

interface Props {
    player: PlayerProfile
    last3Months: boolean
}

const WinPercentageGraph: React.FC<Props> = ({ player, last3Months }) => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()
    const [stats, setStats] = useState<PlayerGameStats[]>([])

    useEffect(() => {
        dispatch(StatsService.gameStatsForPlayer(player.id))
            .then(setStats)
            .catch(e =>
                enqueueSnackbar(
                    `Failed to get game stats for player ${player.name}`,
                    { variant: "error" },
                ),
            )
    }, [player])

    const filteredStats = useMemo(() => {
        const fromDate = new Date()
        fromDate.setMonth(fromDate.getMonth() - 3)
        return last3Months
            ? stats.filter(s => new Date(s.timestamp) >= fromDate)
            : stats
    }, [stats, last3Months])

    const wins = useMemo(
        () => filteredStats.filter(g => g.winner),
        [filteredStats],
    )

    const data = useMemo(() => {
        return {
            labels: ["Win", "Loss"],
            datasets: [
                {
                    label: "My Win Percentage",
                    data: [wins.length, filteredStats.length - wins.length],
                    backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"],
                    hoverOffset: 4,
                },
            ],
        }
    }, [wins, filteredStats])

    const options: ChartOptions = useMemo(() => {
        return {
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Win Percentage (${(
                        (wins.length / filteredStats.length) *
                        100
                    ).toFixed(1)}%)`,
                    position: "bottom",
                },
            },
        }
    }, [wins, filteredStats])

    return (
        <>
            {filteredStats.length > 0 ? (
                <>
                    <Doughnut
                        data={data}
                        options={options}
                        width={300}
                        height={300}
                    />
                </>
            ) : (
                "No stats available currently"
            )}
        </>
    )
}

export default WinPercentageGraph