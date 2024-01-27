import {
    Card as MuiCard,
    CardContent,
    CardHeader,
    Grid,
    Switch,
    FormControlLabel,
    Typography,
} from "@mui/material"
import { useCallback, useState } from "react"
import WinPercentageGraph from "./WinPercentageGraph"

const GameStats = () => {
    const [last3Months, setLast3Months] = useState(true)

    const threeMonthsCheckboxChanged = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setLast3Months(e.target.checked)
        },
        [],
    )

    return (
        <Grid container>
            <MuiCard className="p-6 data-card">
                <CardHeader
                    title={<Typography variant="h2">Stats</Typography>}
                />
                {/* <CardContent>
                    {myProfile.isAdmin ? (
                        <PlayerSwitcher onChange={setPlayer} />
                    ) : null}
                </CardContent> */}
                <CardContent>
                    <WinPercentageGraph last3Months={last3Months} />
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
