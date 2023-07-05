import { FormControl, FormLabel, Checkbox, Grid } from "@mui/material"
import { getSettings } from "caches/SettingsSlice"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import { useSnackbar } from "notistack"
import React, { useCallback } from "react"
import SettingsService from "services/SettingsService"
import parseError from "utils/ErrorUtils"

const GamePlaySettings: React.FC = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()
    const settings = useAppSelector(getSettings)

    const toggleAutoBuy = useCallback(async () => {
        const updatedSettings = {
            ...settings,
            autoBuyCards: !settings.autoBuyCards,
        }
        await dispatch(SettingsService.updateSettings(updatedSettings)).catch(
            (e: Error) => enqueueSnackbar(parseError(e), { variant: "error" }),
        )
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
                        checked={settings.autoBuyCards}
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
