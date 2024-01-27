import React, { useMemo } from "react"
import { PlayerProfile } from "model/Player"
import { Doughnut } from "react-chartjs-2"
import "chart.js/auto"
import { ChartOptions } from "chart.js"
import { useTheme } from "@mui/material"
import { useStats } from "components/Hooks/useStats"

interface Props {
    player?: PlayerProfile
    last3Months: boolean
    width?: number
    height?: number
    showLegend?: boolean
}

const WinPercentageGraph: React.FC<Props> = ({
    player,
    last3Months,
    width = 300,
    height = 300,
    showLegend = true,
}) => {
    const { stats } = useStats(player?.id ?? "")
    const theme = useTheme()

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
                    data: [wins.length, filteredStats.length - wins.length],
                    backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"],
                    hoverOffset: 4,
                },
            ],
        }
    }, [wins, filteredStats])

    const options: ChartOptions<"doughnut"> = useMemo(() => {
        return {
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${(
                        (wins.length / filteredStats.length) *
                        100
                    ).toFixed(1)}% win rate`,
                    position: "bottom",
                    color: theme.palette.text.primary,
                },
                legend: {
                    display: showLegend,
                    labels: {
                        color: theme.palette.text.primary,
                    },
                },
            },
        }
    }, [wins, filteredStats, theme])

    return (
        <>
            {filteredStats.length > 0 ? (
                <Doughnut
                    data={data}
                    options={options}
                    width={width}
                    height={height}
                />
            ) : (
                "No stats available currently"
            )}
        </>
    )
}

export default WinPercentageGraph
