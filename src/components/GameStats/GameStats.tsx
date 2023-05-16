import {
    Card as MuiCard,
    CardContent,
    CardHeader,
    Grid,
    Switch,
    FormControlLabel,
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useAppSelector } from "caches/hooks"
import { getMyProfile } from "caches/MyProfileSlice"
import PlayerSwitcher from "./PlayerSwitcher"
import WinPercentageGraph from "./WinPercentageGraph"
import { PlayerProfile } from "model/Player"

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
        <Grid container>
            <MuiCard className="p-6 data-card">
                <CardHeader title="Stats" />
                <CardContent>
                    {myProfile.isAdmin ? (
                        <PlayerSwitcher onChange={setPlayer} />
                    ) : null}
                </CardContent>
                <CardContent>
                    {player ? (
                        <WinPercentageGraph
                            player={player}
                            last3Months={last3Months}
                        />
                    ) : null}
                </CardContent>
                <FormControlLabel
                    control={
                        <Switch
                            checked={last3Months}
                            onChange={threeMonthsCheckboxChanged}
                        />
                    }
                    label="Last 3 months"
                />
            </MuiCard>
        </Grid>
    )
}

export default GameStats
