import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material"

import Leaderboard from "components/Leaderboard/Leaderboard"
import Confetti from "react-confetti"

const GameOver = () => {
    return (
        <Grid container justifyContent="center">
            <Grid item>
                <Card>
                    <CardHeader
                        title={<Typography variant="h2">Game Over</Typography>}
                    />
                    <CardContent>
                        <Leaderboard />
                    </CardContent>
                </Card>
            </Grid>
            <Confetti
                colors={["#e6ee9c", "#f44336", "#2196f3"]}
                numberOfPieces={400}
                recycle={false}
                run={true}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        </Grid>
    )
}

export default GameOver
