import { ButtonGroup, CardBody } from "reactstrap"
import {
    getIsRoundBuying,
    getIsRoundCalled,
    getIsRoundCalling,
    getIsRoundPlaying,
} from "../../../caches/GameSlice"
import { useAppSelector } from "../../../caches/hooks"
import Buying from "./Buying"
import Calling from "./Calling"
import PlayCard from "./PlayCard"
import SelectSuit from "./SelectSuit"

const ActionsWrapper = () => {
    const isBuying = useAppSelector(getIsRoundBuying)
    const isCalling = useAppSelector(getIsRoundCalling)
    const isPlaying = useAppSelector(getIsRoundPlaying)
    const isCalled = useAppSelector(getIsRoundCalled)

    return (
        <CardBody className="buttonArea">
            <ButtonGroup size="lg">
                {isCalling && <Calling />}
                {isBuying && <Buying />}
                {isCalled && <SelectSuit />}
                {isPlaying && <PlayCard />}
            </ButtonGroup>
        </CardBody>
    )
}

export default ActionsWrapper
