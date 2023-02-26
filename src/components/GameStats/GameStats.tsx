import { Doughnut } from "react-chartjs-2"
import { Card, CardHeader, CardBody, CardGroup, Input, Label } from "reactstrap"
import { useCallback, useMemo, useState } from "react"
import { useAppSelector } from "../../caches/hooks"
import { getGameStats } from "../../caches/GameStatsSlice"
import "chart.js/auto"
import { ChartOptions } from "chart.js"
import { getMyProfile } from "../../caches/MyProfileSlice"
import PlayerSwitcher from "./PlayerSwitcher"

const GameStats = () => {
    const myProfile = useAppSelector(getMyProfile)
    const stats = useAppSelector(getGameStats)

    const [last3Months, updateLast3Months] = useState(true)

    const fromDate = new Date()
    fromDate.setMonth(fromDate.getMonth() - 3)

    const filteredStats = useMemo(
        () =>
            last3Months
                ? stats.filter(s => new Date(s.timestamp) >= fromDate)
                : stats,
        [last3Months, stats],
    )

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

    const threeMonthsCheckboxChanged = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateLast3Months(e.target.checked)
        },
        [],
    )

    if (!stats) {
        return null
    }

    return (
        <CardGroup>
            <Card className="p-6 data-card">
                <CardHeader tag="h2">Stats </CardHeader>
                <CardBody>
                    {myProfile.isAdmin ? <PlayerSwitcher /> : null}
                </CardBody>
                <CardBody>
                    {filteredStats.length > 0 ? (
                        <Doughnut
                            data={data}
                            options={options}
                            width={300}
                            height={300}
                        />
                    ) : (
                        "No stats available currently"
                    )}
                </CardBody>
                <Label>
                    <Input
                        checked={last3Months}
                        type="checkbox"
                        onChange={threeMonthsCheckboxChanged}
                    />
                    Last 3 months
                </Label>
            </Card>
        </CardGroup>
    )
}

export default GameStats
