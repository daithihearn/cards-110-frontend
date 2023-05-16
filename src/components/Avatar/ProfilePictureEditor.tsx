import React, { useCallback, useRef, useState } from "react"

import heic2any from "heic2any"
import { useSnackbar } from "notistack"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    Slider,
    Grid,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import { getMyProfile } from "caches/MyProfileSlice"
import ProfileService from "services/ProfileService"
import AvatarEditor from "react-avatar-editor"
import parseError from "utils/ErrorUtils"

interface InputsI {
    show: boolean
    callback: () => void
}
const ProfilePictureEditor: React.FC<InputsI> = ({ show, callback }) => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const [selectedImage, updateSelectedImage] = useState<File>()
    const [scale, updateScale] = useState(1.2)
    const editorRef = useRef<any>()
    const setEditorRef = useCallback(
        (b: any) => (editorRef.current = b),
        [editorRef],
    )

    const myProfile = useAppSelector(getMyProfile)

    const handleScale = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newScale = parseFloat(e.target.value)
            updateScale(newScale)
        },
        [],
    )

    const handleSave = useCallback(
        (event: React.SyntheticEvent<HTMLButtonElement>) => {
            event.preventDefault()
            const canvasScaled = editorRef.current.getImageScaledToCanvas()
            const croppedImg = canvasScaled.toDataURL()

            dispatch(
                ProfileService.updateProfile({
                    name: myProfile.name,
                    picture: croppedImg,
                    forceUpdate: true,
                }),
            )
                .catch((e: Error) =>
                    enqueueSnackbar(parseError(e), { variant: "error" }),
                )
                .finally(callback)
        },
        [myProfile, editorRef],
    )

    const handleNewAvatarSelection = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        event.preventDefault()
        if (!event.target.files || event.target.files.length < 1) return
        const file = event.target.files[0]

        if (file.type.includes("heic")) {
            heic2any({ blob: file, toType: "image/jpg", quality: 1 }).then(
                jpgFile => {
                    updateSelectedImage(jpgFile as File)
                },
            )
        } else updateSelectedImage(file)
    }

    return (
        <Dialog onClose={callback} open={show}>
            <DialogTitle>Edit Profile Picture</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    {selectedImage && (
                        <AvatarEditor
                            ref={setEditorRef}
                            image={selectedImage}
                            width={250}
                            height={250}
                            border={50}
                            color={[255, 255, 255, 0.6]} // RGBA
                            scale={scale}
                            rotate={0}
                        />
                    )}
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel htmlFor="newAvatar">New Avatar</InputLabel>
                    <Input
                        type="file"
                        // accept="image/*,.heic"
                        name="newAvatar"
                        id="newAvatar"
                        onChange={handleNewAvatarSelection}
                        // multiple={false}
                    />
                    <FormHelperText>
                        Please choose your new avatar
                    </FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <Slider
                                name="scale"
                                onChange={(_, value) =>
                                    updateScale(value as number)
                                }
                                min={1}
                                max={2}
                                step={0.01}
                                defaultValue={1.2}
                            />
                        </Grid>
                    </Grid>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={callback} color="secondary">
                    Cancel
                </Button>
                <Button
                    disabled={!selectedImage}
                    type="button"
                    onClick={handleSave}
                    color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProfilePictureEditor
