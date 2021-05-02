import { Row, Col, CardImgOverlay, CardText, CardImg, CardBody, Container } from 'reactstrap'

import { useSelector } from 'react-redux'


const PlayersAndCards = () => {
    const game = useSelector(state => state.game.game)
    const players = useSelector(state => state.game.players)

    const compareSeat = (a, b) => {
        let comparison = 0
        if (a.seatNumber > b.seatNumber) {
            comparison = 1
        } else if (a.seatNumber < b.seatNumber) {
            comparison = -1
        }
        return comparison
    }

    const isDealer = (game, playerId) => {
        return (!!game.round && game.round.dealerId === playerId);
    }

    return (
        <CardBody className="cardArea">
            <Container>
                <Row>
                    {game.playerProfiles.sort(compareSeat).map((playerProfile, idx) =>
                        <Col key={`cards_${idx}`} className="player-column">
                            <div>
                                <CardImg alt={players.find(p => p.id === playerProfile.id).name} src={players.find(q => q.id === playerProfile.id).picture} className="avatar" />
                                <CardImgOverlay>
                                    <CardText className="overlay-score">{playerProfile.score}</CardText>
                                </CardImgOverlay>
                            </div>


                            <div>

                                {(!!game.round.currentHand.playedCards[playerProfile.id]) ?

                                    <CardImg alt={playerProfile.displayName} src={`/cards/thumbnails/${game.round.currentHand.playedCards[playerProfile.id]}.png`} className="thumbnail_size" />

                                    :
                                    <a>
                                        <CardImg alt={playerProfile.displayName}
                                            src={`/cards/thumbnails/${(game.round.currentHand.currentPlayerId === playerProfile.id) ? "yellow" : "blank_grey"}_back.png`}
                                            className={`thumbnail_size ${(game.round.currentHand.currentPlayerId === playerProfile.id) ? "" : "transparent"}`} />

                                        {!game.round.suit && isDealer(game, playerProfile.id) ?
                                            <CardImgOverlay>
                                                <CardImg alt="Dealer Chip" src={"/cards/originals/DEALER.png"} className="thumbnail_chips overlay-dealer-chip" />
                                            </CardImgOverlay>
                                            : null}

                                        {!game.round.suit ?
                                            <CardImgOverlay>
                                                {(playerProfile.call === 10) ? <CardImg alt="Ten Chip" src={"/cards/originals/call_10.png"} className="thumbnail_chips overlay-chip" /> : null}
                                                {(playerProfile.call === 15) ? <CardImg alt="15 Chip" src={"/cards/originals/call_15.png"} className="thumbnail_chips overlay-chip" /> : null}
                                                {(playerProfile.call === 20) ? <CardImg alt="20 Chip" src={"/cards/originals/call_20.png"} className="thumbnail_chips overlay-chip" /> : null}
                                                {(playerProfile.call === 25) ? <CardImg alt="25 Chip" src={"/cards/originals/call_25.png"} className="thumbnail_chips overlay-chip" /> : null}
                                                {(playerProfile.call === 30) ? <CardImg alt="Jink Chip" src={"/cards/originals/call_jink.png"} className="thumbnail_chips overlay-chip" /> : null}
                                            </CardImgOverlay>
                                            : null}

                                    </a>
                                }
                            </div>

                            <div>


                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </CardBody>
    )
}

export default PlayersAndCards