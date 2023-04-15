import { Card, CardBody, CardGroup, Container, CardHeader } from "reactstrap"

import Leaderboard from "components/Leaderboard/Leaderboard"
import Confetti from "react-confetti"

const GameOver = () => {
    return (
        <CardGroup>
            <Card className="p-6 data-card">
                <CardHeader className="cardAreaHeaderContainer" tag="h2">
                    Game Over
                </CardHeader>
                <CardBody>
                    <Confetti
                        colors={["#e6ee9c", "#f44336", "#2196f3"]}
                        numberOfPieces={200}
                        recycle={false}
                        run={true}
                    />
                    <Leaderboard />
                </CardBody>
            </Card>
        </CardGroup>
    )
}

export default GameOver
