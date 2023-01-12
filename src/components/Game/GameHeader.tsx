import { useEffect, useState } from "react"

import {
  Modal,
  ModalBody,
  Button,
  Row,
  Col,
  CardImg,
  Container,
  CardHeader,
} from "reactstrap"
import { getGame } from "../../caches/GameSlice"
import { useAppSelector } from "../../caches/hooks"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { PlayerProfile } from "../../model/Player"
import { RoundStatus } from "../../model/Round"
import Leaderboard from "../Leaderboard/Leaderboard"

const GameHeader = () => {
  const playerProfiles = useAppSelector(getPlayerProfiles)
  const game = useAppSelector(getGame)
  const [modalLeaderboard, updateModalLeaderboard] = useState(false)
  const [goer, setGoer] = useState<PlayerProfile>()

  useEffect(() => {
    if (game.round && game.round.goerId) {
      const g = playerProfiles.find(
        (p) => game.round && p.id === game.round.goerId
      )
      if (g) setGoer(g)
    }
  }, [game, playerProfiles])

  if (
    !game ||
    !game.status ||
    !game.round ||
    !playerProfiles ||
    playerProfiles.length === 0
  ) {
    return null
  }

  const toggleLeaderboardModal = () => {
    updateModalLeaderboard(!modalLeaderboard)
  }

  return (
    <CardHeader className="cardAreaHeaderContainer">
      <Container>
        <Row>
          <Col xs="0">
            <Button
              type="button"
              className="float-left leaderboard-button"
              color="info"
              onClick={toggleLeaderboardModal}
            >
              <img
                className="thumbnail_size_extra_small"
                alt="Leaderboard"
                src="/assets/img/leaderboard.png"
              />
            </Button>
          </Col>

          {goer ? (
            <Col xs="9">
              <h2 className="cardAreaHeader">
                <CardImg
                  alt={goer.name}
                  src={goer.picture}
                  className="thumbnail_size_extra_small"
                />

                <CardImg
                  alt="Chip"
                  src={`/cards/originals/call_${
                    game.players.filter((profile) => profile.id === goer.id)[0]
                      .call
                  }.png`}
                  className="thumbnail_size_extra_small left-padding"
                />

                <CardImg
                  alt="Suit"
                  src={`/cards/originals/${game.round.suit}_ICON.svg`}
                  className="thumbnail_size_extra_small left-padding"
                />
              </h2>
            </Col>
          ) : null}

          {!game.iamSpectator &&
          ((!game.iamDealer && game.cards.length === 0) ||
            (!!game.round &&
              game.round.status === RoundStatus.CALLED &&
              !game.iamGoer)) ? (
            <Col>
              <div className="game-heading">
                <h4>Waiting...</h4>
              </div>
            </Col>
          ) : null}
        </Row>
      </Container>
      {!!game.round.currentHand && !!game.players && !!playerProfiles ? (
        <Modal
          fade={true}
          size="lg"
          toggle={toggleLeaderboardModal}
          isOpen={modalLeaderboard}
        >
          <ModalBody className="gameModalBody">
            <Leaderboard />
          </ModalBody>
        </Modal>
      ) : null}
    </CardHeader>
  )
}

export default GameHeader
