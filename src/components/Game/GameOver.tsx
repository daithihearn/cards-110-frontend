import { Card, CardBody, CardGroup, Container, CardHeader } from "reactstrap"

import Leaderboard from "../Leaderboard/Leaderboard"

const GameOver = () => {
    return (
        <CardGroup>
            <Card color="secondary" className="p-6">
                <CardHeader className="cardAreaHeaderContainer" tag="h2">
                    Game Over
                </CardHeader>
                <CardBody>
                    <Container>
                        <Leaderboard />
                    </Container>
                </CardBody>
            </Card>
        </CardGroup>
    )
}

export default GameOver
