import React, { useCallback, useRef, useState } from "react"

import heic2any from "heic2any"
import {
    Button,
    FormControl,
    FormHelperText,
    Input,
    Slider,
    Grid,
    ButtonGroup,
    Box,
} from "@mui/material"
import AvatarEditor from "react-avatar-editor"
import { useProfiles } from "components/Hooks/useProfiles"

const ProfilePictureEditor: React.FC = () => {
    const { myProfile, updateProfile } = useProfiles()

    const [selectedImage, updateSelectedImage] = useState<File>()
    const [scale, updateScale] = useState(1.2)
    const editorRef = useRef<AvatarEditor>()
    const setEditorRef = useCallback(
        (b: any) => (editorRef.current = b),
        [editorRef],
    )
    const fileInputRef = useRef<HTMLInputElement>()
    const setFileInputRef = useCallback(
        (b: any) => (fileInputRef.current = b),
        [fileInputRef],
    )

    const reset = useCallback(() => {
        updateSelectedImage(undefined)
        updateScale(1.2)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
            fileInputRef.current.files = null
        }
    }, [fileInputRef])

    const handleSave = useCallback(
        (event: React.SyntheticEvent<HTMLButtonElement>) => {
            event.preventDefault()
            if (!editorRef.current || !myProfile) return
            const canvasScaled = editorRef.current.getImageScaledToCanvas()
            const croppedImg = canvasScaled.toDataURL()

            updateProfile({
                name: myProfile.name,
                picture: croppedImg,
                forceUpdate: true,
            })
        },
        [myProfile, editorRef, fileInputRef],
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
        <>
            <FormControl fullWidth>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={200}>
                    {selectedImage && (
                        <AvatarEditor
                            ref={setEditorRef}
                            image={selectedImage}
                            width={150}
                            height={150}
                            border={25}
                            color={[255, 255, 255, 0.6]} // RGBA
                            scale={scale}
                            rotate={0}
                        />
                    )}
                </Box>
            </FormControl>
            <FormControl fullWidth>
                <Input
                    ref={setFileInputRef}
                    type="file"
                    // accept="image/*,.heic"
                    name="newAvatar"
                    id="newAvatar"
                    onChange={handleNewAvatarSelection}
                    // multiple={false}
                />
                <FormHelperText>Please choose your new avatar</FormHelperText>
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
                            color="secondary"
                        />
                    </Grid>
                </Grid>
            </FormControl>
            <FormControl fullWidth>
                <ButtonGroup fullWidth>
                    <Button
                        type="button"
                        onClick={reset}
                        color="secondary"
                        variant="outlined">
                        Reset
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        color="secondary"
                        variant="outlined">
                        Save
                    </Button>
                </ButtonGroup>
            </FormControl>
        </>
    )
}

export default ProfilePictureEditor
