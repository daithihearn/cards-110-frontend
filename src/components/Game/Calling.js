import { useDispatch } from 'react-redux'
import { Button, ButtonGroup, CardBody } from 'reactstrap'

import parseError from '../../utils/ErrorUtils'

import GameService from '../../services/GameService'
import { triggerBounceMessage } from '../../constants'

const Calling = (props) => {

    const game = props.game
    const actionsDisabled = props.actionsDisabled
    if (!game) {
        return null
    }

    const dispatch = useDispatch()

    const call = (callAmount) => e => {
        GameService.call(game.id, callAmount).catch(error => {
            if (error.message === triggerBounceMessage) { return }
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }

    return (
        <div>
            {!!game.round && game.round.status === "CALLING" ?

                <CardBody className="buttonArea">

                    {(!!game.round.currentHand && game.cards.length > 0 && game.round.currentHand.currentPlayerId === game.me.id) ?

                        <ButtonGroup size="lg">
                            <Button type="button" color="secondary" disabled={actionsDisabled} onClick={call(0)}>Pass</Button>
                            {(game.playerProfiles.length === 6 && ((game.me.id === game.round.dealerId && game.maxCall <= 10) || game.maxCall < 10)) ? <Button type="button" color="primary" onClick={call(10)}>10</Button> : null}
                            {(game.me.id === game.round.dealerId && game.maxCall <= 15) || game.maxCall < 15 ? <Button type="button" disabled={actionsDisabled} color="warning" onClick={call(15)}>15</Button> : null}
                            {(game.me.id === game.round.dealerId && game.maxCall <= 20) || game.maxCall < 20 ? <Button type="button" disabled={actionsDisabled} color="warning" onClick={call(20)}>20</Button> : null}
                            {(game.me.id === game.round.dealerId && game.maxCall <= 25) || game.maxCall < 25 ? <Button type="button" disabled={actionsDisabled} color="warning" onClick={call(25)}>25</Button> : null}
                            <Button type="button" disabled={actionsDisabled} color="danger" onClick={call(30)}>Jink</Button>
                        </ButtonGroup>

                        :
                        <ButtonGroup size="lg">
                            <Button type="button" color="warning" disabled={true}>Please wait your turn...</Button>
                        </ButtonGroup>}

                </CardBody>

                : null}
        </div>
    )
}

export default Calling