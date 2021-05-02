
import { useSelector } from 'react-redux'
import { Card, CardBody, CardGroup, Container, CardHeader } from 'reactstrap'

import Leaderboard from '../Leaderboard/Leaderboard'

const GameOver = () => {

    const players = useSelector(state => state.game.players)
    const game = useSelector(state => state.game.game)

    if (game.status === "FINISHED") {
        return (

            <CardGroup>
                <Card color="secondary" className="p-6">
                    <CardHeader className="cardAreaHeaderContainer" tag="h2">
                        Game Over
                    </CardHeader>
                    <CardBody>
                        {!!game && !!game.round.currentHand && !!game.playerProfiles && !!players ?
                            <Container>
                                <Leaderboard playerProfiles={game.playerProfiles} players={players} currentHand={game.round.currentHand} gameOver={true} />
                            </Container>
                            : null}

                    </CardBody>
                </Card>
            </CardGroup>
        )
    }
    return null
}

export default GameOver