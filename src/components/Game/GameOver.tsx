import { Card, CardBody, CardGroup, Container, CardHeader } from "reactstrap"

import Leaderboard from "components/Leaderboard/Leaderboard"

const GameOver = () => {
    return (
        <CardGroup>
            <Card className="p-6 data-card">
                <CardHeader className="cardAreaHeaderContainer" tag="h2">
                    Game Over
                </CardHeader>
                <CardBody>
                    <Leaderboard />
                </CardBody>
            </Card>
        </CardGroup>
    )
}

export default GameOver
