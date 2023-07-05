import React from "react"

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material"
import ProfilePictureEditor from "./Avatar/ProfilePictureEditor"
import GamePlaySettings from "./GamePlaySettings"

interface InputsI {
    show: boolean
    callback: () => void
}
const Settings: React.FC<InputsI> = ({ show, callback }) => {
    return (
        <Dialog onClose={callback} open={show}>
            <DialogTitle>Avatar</DialogTitle>
            <DialogContent>
                <ProfilePictureEditor />
            </DialogContent>
            <DialogTitle>Gameplay</DialogTitle>
            <DialogContent>
                <GamePlaySettings />
            </DialogContent>
            <DialogActions>
                <Button onClick={callback} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Settings
