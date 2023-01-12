import { Doughnut } from "react-chartjs-2"
import { Card, CardHeader, CardBody, CardGroup, Input, Label } from "reactstrap"
import { useCallback, useState } from "react"
import { useAppSelector } from "../../caches/hooks"
import { getGameStats } from "../../caches/GameStatsSlice"
import { ChartOptions } from "chart.js"

const GameStats = () => {
  const stats = useAppSelector(getGameStats)

  const [last3Months, updateLast3Months] = useState(false)

  const fromDate = new Date()
  fromDate.setMonth(fromDate.getMonth() - 3)

  const filteredStats = last3Months
    ? stats.filter((s) => new Date(s.timestamp) >= fromDate)
    : stats
  const wins = filteredStats.filter((g) => g.winner)
  const data = {
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

  const options: ChartOptions = {
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

  const threeMonthsCheckboxChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLast3Months(e.target.checked)
    },
    []
  )

  if (!stats) {
    return null
  }

  return (
    <CardGroup>
      <Card color="secondary" className="p-6">
        <CardHeader tag="h2">My Stats </CardHeader>
        <CardBody>
          {!!stats && stats.length > 0 ? (
            <Doughnut data={data} options={options} width={300} height={300} />
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
