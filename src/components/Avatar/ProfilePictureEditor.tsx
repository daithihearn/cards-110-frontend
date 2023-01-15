import React, { useCallback, useRef, useState } from "react"

import heic2any from "heic2any"
import { useSnackbar } from "notistack"
import {
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    Button,
    FormGroup,
    FormText,
    Input,
    ButtonGroup,
} from "reactstrap"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { getMyProfile } from "../../caches/MyProfileSlice"
import ProfileService from "../../services/ProfileService"
import AvatarEditor from "react-avatar-editor"

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
                    enqueueSnackbar(e.message, { variant: "error" }),
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
        <Modal fade toggle={callback} isOpen={show}>
            <ModalBody>
                <FormGroup row>
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
                </FormGroup>
                <FormGroup row>
                    <Col sm={10}>
                        <Input
                            type="file"
                            accept="image/*,.heic"
                            name="newAvatar"
                            id="newAvatar"
                            onChange={handleNewAvatarSelection}
                            multiple={false}
                        />
                        <FormText color="muted">
                            Please choose your new avatar
                        </FormText>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col sm={10}>
                        <Input
                            name="scale"
                            type="range"
                            onChange={handleScale}
                            min="1"
                            max="2"
                            step="0.01"
                            defaultValue="1.2"
                        />
                    </Col>
                </FormGroup>
            </ModalBody>

            <ModalFooter>
                <ButtonGroup size="lg">
                    <Button color="secondary" onClick={callback}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        disabled={!selectedImage}
                        type="button"
                        onClick={handleSave}>
                        Save
                    </Button>
                </ButtonGroup>
            </ModalFooter>
        </Modal>
    )
}

export default ProfilePictureEditor
