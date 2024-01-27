import { FormControl, FormLabel, Checkbox, Grid } from "@mui/material"
import { useSettings } from "components/Hooks/useSettings"
import { PlayerSettings } from "model/PlayerSettings"
import React, { useCallback } from "react"

const GamePlaySettings: React.FC = () => {
    const { settings, updateSettings } = useSettings()

    const toggleAutoBuy = useCallback(async () => {
        const updatedSettings: PlayerSettings = {
            ...settings,
            autoBuyCards: !settings?.autoBuyCards,
        }
        updateSettings(updatedSettings)
    }, [settings])

    return (
        <FormControl fullWidth>
            <Grid container alignItems="center">
                <Grid item>
                    <FormLabel
                        htmlFor="autoBuyCheckbox"
                        sx={{ "&.Mui-focused": { color: "inherit" } }}>
                        Auto Buy Cards
                    </FormLabel>
                </Grid>
                <Grid item>
                    <Checkbox
                        id="autoBuyCheckbox"
                        checked={settings?.autoBuyCards}
                        onChange={toggleAutoBuy}
                        sx={{
                            "&.Mui-checked": {
                                color: "inherit",
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </FormControl>
    )
}

export default GamePlaySettings
