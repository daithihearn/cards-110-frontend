
import { useSelector } from 'react-redux'
import { Card, CardBody, CardGroup, Container, CardHeader } from 'reactstrap'

import Leaderboard from '../Leaderboard/Leaderboard'

const GameOver = () => {

    const players = useSelector(state => state.game.players)
    const game = useSelector(state => state.game.game)

    if (!game || !game.status || game.status !== "FINISHED" || !players || players.length === 0) {
        return null
    }

    return (

        <CardGroup>
            <Card color="secondary" className="p-6">
                <CardHeader className="cardAreaHeaderContainer" tag="h2">
                    Game Over
                    </CardHeader>
                <CardBody>
                    {!!game && !!game.round.currentHand && !!game.playerProfiles && !!players ?
                        <Container>
                            <Leaderboard game={game} players={players} />
                        </Container>
                        : null}

                </CardBody>
            </Card>
        </CardGroup>
    )

}

export default GameOver