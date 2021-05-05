
import { useState } from 'react'

import { Modal, ModalBody, Button, Row, Col, CardImg, Container, CardHeader } from 'reactstrap'
import Leaderboard from '../Leaderboard/Leaderboard'
import {doPlayersMatchProfiles} from '../../constants'

const GameHeader = (props) => {

    const players = props.players
    const game = props.game
    if (!game || !game.status || !players || players.length === 0 || !doPlayersMatchProfiles(players, game.playerProfiles)) {
        return null
    }

    const [modalLeaderboard, updateModalLeaderboard] = useState(false)

    const toggleLeaderboardModal = () => {
        updateModalLeaderboard(!modalLeaderboard)
    }

    return (
        <CardHeader className="cardAreaHeaderContainer">
            <Container>
                <Row>
                    <Col xs="0">
                        <Button type="button" className="float-left leaderboard-button" color="info" onClick={toggleLeaderboardModal}><img className="thumbnail_size_extra_small" alt="Leaderboard" src="/assets/img/leaderboard.png" /></Button>
                    </Col>

                    {!!game.round.suit ?
                        <Col xs="9">
                            <h2 className="cardAreaHeader">
                                <CardImg alt={players.find(p => p.id === game.round.goerId).name} src={players.find(q => q.id === game.round.goerId).picture} className="thumbnail_size_extra_small" />

                                <CardImg alt="Chip" src={`/cards/originals/call_${game.playerProfiles.filter(profile => profile.id === game.round.goerId)[0].call}.png`} className="thumbnail_size_extra_small left-padding" />

                                <CardImg alt="Suit" src={`/cards/originals/${game.round.suit}_ICON.svg`} className="thumbnail_size_extra_small left-padding" />
                            </h2>
                        </Col>
                        : null}

                    {!game.iamSpectator && ((!game.iamDealer && game.cards.length === 0) || (!!game.round && game.round.status === "CALLED" && !game.iamGoer)) ?
                        <Col>
                            <div className="game-heading"><h4>Waiting...</h4></div>
                        </Col>
                        : null}
                </Row>
            </Container>
            { !!game.round.currentHand && !!game.playerProfiles && !!players ?

                <Modal fade={true} size="lg" toggle={toggleLeaderboardModal} isOpen={modalLeaderboard}>
                    <ModalBody className="gameModalBody">
                        <Leaderboard game={game} players={players}/>
                    </ModalBody>
                </Modal>

                : null}
        </CardHeader>
    )
}

export default GameHeader