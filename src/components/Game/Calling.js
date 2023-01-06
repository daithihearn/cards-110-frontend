import { useDispatch, useSelector } from "react-redux"
import { Button, ButtonGroup, CardBody } from "reactstrap"

import parseError from "../../utils/ErrorUtils"
import { useAuth0 } from "@auth0/auth0-react"

import GameService from "../../services/GameService"
import { triggerBounceMessage } from "../../constants"

const Calling = (props) => {
  const game = props.game
  if (!game) {
    return null
  }

  const buttonsEnabled =
    !!game.round.currentHand && game.cards.length > 0 && game.isMyGo

  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()

  const call = (callAmount) => (e) => {
    getAccessTokenSilently()
      .then((accessToken) => {
        GameService.call(game.id, callAmount, accessToken).catch((error) => {
          if (error.message === triggerBounceMessage) {
            return
          }
          dispatch({
            type: "snackbar/message",
            payload: { type: "error", message: parseError(error) },
          })
        })
      })
      .catch((error) => {
        dispatch({
          type: "snackbar/message",
          payload: { type: "error", message: parseError(error) },
        })
      })
  }

  return (
    <div>
      {!!game.round && game.round.status === "CALLING" ? (
        <CardBody className="buttonArea">
          <ButtonGroup size="lg">
            <Button
              disabled={!buttonsEnabled}
              type="button"
              color="secondary"
              onClick={call(0)}
            >
              Pass
            </Button>
            {game.playerProfiles.length === 6 &&
            ((game.iamDealer && game.maxCall <= 10) || game.maxCall < 10) ? (
              <Button
                disabled={!buttonsEnabled}
                type="button"
                color="primary"
                onClick={call(10)}
              >
                10
              </Button>
            ) : null}
            {(game.iamDealer && game.maxCall <= 15) || game.maxCall < 15 ? (
              <Button
                disabled={!buttonsEnabled}
                type="button"
                color="warning"
                onClick={call(15)}
              >
                15
              </Button>
            ) : null}
            {(game.iamDealer && game.maxCall <= 20) || game.maxCall < 20 ? (
              <Button
                disabled={!buttonsEnabled}
                type="button"
                color="warning"
                onClick={call(20)}
              >
                20
              </Button>
            ) : null}
            {(game.iamDealer && game.maxCall <= 25) || game.maxCall < 25 ? (
              <Button
                disabled={!buttonsEnabled}
                type="button"
                color="warning"
                onClick={call(25)}
              >
                25
              </Button>
            ) : null}
            <Button
              disabled={!buttonsEnabled}
              type="button"
              color="danger"
              onClick={call(30)}
            >
              {game.playerProfiles.length > 2 ? "Jink" : "30"}
            </Button>
          </ButtonGroup>
        </CardBody>
      ) : null}
    </div>
  )
}

export default Calling
