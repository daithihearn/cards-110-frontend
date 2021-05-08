import { Doughnut } from 'react-chartjs-2'
import { Card, CardHeader, CardBody, CardGroup } from 'reactstrap'
import { useSelector } from 'react-redux'

const GameStats = () => {
    const stats = useSelector(state => state.gameStats.stats)
    if (!stats) { return null }

    const wins = stats.filter(g => g.winner)
    const data = {
        labels: [
            'Win',
            'Loss'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [wins.length, stats.length - wins.length],
            backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)'
            ],
            hoverOffset: 4
        }]
    }

    return (
        <CardGroup>
            <Card color="secondary" className="p-6">
                <CardHeader tag="h2">My Stats</CardHeader>
                <CardBody>
                    <Doughnut data={data} 
                        width={300}
                        height={300}
                        options={{ maintainAspectRatio: false }} />
                </CardBody>
            </Card>
        </CardGroup>

    )
}

export default GameStats