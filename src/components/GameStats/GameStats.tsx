import { Card, CardHeader, CardBody, CardGroup, Input, Label } from "reactstrap"
import { useCallback, useEffect, useState } from "react"
import { useAppSelector } from "../../caches/hooks"
import { getMyProfile } from "../../caches/MyProfileSlice"
import PlayerSwitcher from "./PlayerSwitcher"
import WinPercentageGraph from "./WinPercentageGraph"
import { PlayerProfile } from "../../model/Player"

const GameStats = () => {
    const myProfile = useAppSelector(getMyProfile)
    const [player, setPlayer] = useState<PlayerProfile>()
    const [last3Months, updateLast3Months] = useState(true)

    useEffect(() => setPlayer(myProfile), [myProfile])
    const threeMonthsCheckboxChanged = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateLast3Months(e.target.checked)
        },
        [],
    )

    return (
        <CardGroup>
            <Card className="p-6 data-card">
                <CardHeader tag="h2">Stats </CardHeader>
                <CardBody>
                    {myProfile.isAdmin ? (
                        <PlayerSwitcher onChange={setPlayer} />
                    ) : null}
                </CardBody>
                <CardBody>
                    {player ? (
                        <WinPercentageGraph
                            player={player}
                            last3Months={last3Months}
                        />
                    ) : null}
                </CardBody>
                <Label>
                    <Input
                        checked={last3Months}
                        type="checkbox"
                        onChange={threeMonthsCheckboxChanged}
                    />
                    Last 3 months
                </Label>
            </Card>
        </CardGroup>
    )
}

export default GameStats
