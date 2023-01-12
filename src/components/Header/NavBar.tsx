import React, { useCallback, useRef, useState } from "react"
import { Link } from "react-router-dom"
import profileService from "../../services/ProfileService"
import { useAuth0 } from "@auth0/auth0-react"

import AvatarEditor from "react-avatar-editor"
import heic2any from "heic2any"

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
import { useSnackbar } from "notistack"

const NavBar = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const { logout } = useAuth0()

  const [modalUpdateProfileOpen, updateModalUpdateProfileOpen] = useState(false)
  const [selectedImage, updateSelectedImage] = useState<File>()
  const [scale, updateScale] = useState(1.2)
  const editorRef = useRef<any>()
  const setEditorRef = useCallback(
    (b: any) => (editorRef.current = b),
    [editorRef]
  )

  const myProfile = useAppSelector(getMyProfile)

  const signOut = () => {
    logout({ returnTo: window.location.origin })
    clearGame()
  }

  const handleScale = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value)
    updateScale(newScale)
  }, [])

  const handleSave = useCallback(() => {
    const canvasScaled = editorRef.current.getImageScaledToCanvas()
    const croppedImg = canvasScaled.toDataURL()

    dispatch(
      profileService.updateProfile({
        name: myProfile.name,
        picture: croppedImg,
        forceUpdate: true,
      })
    ).catch((e: Error) => enqueueSnackbar(e.message, { variant: "error" }))

    updateModalUpdateProfileOpen(false)
  }, [myProfile, editorRef])

  const clearGame = () => {
    dispatch({ type: "game/exit" })
  }

  const showUpdateProfileModal = () => {
    updateModalUpdateProfileOpen(true)
  }

  const handleCloseUpdateProfileModal = useCallback(() => {
    updateModalUpdateProfileOpen(false)
  }, [])

  const handleNewAvatarSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length < 1) return
      const file = event.target.files[0]

      if (file.type.includes("heic")) {
        heic2any({ blob: file, toType: "image/jpg", quality: 1 }).then(
          (jpgFile) => {
            updateSelectedImage(jpgFile as File)
          }
        )
      } else {
        updateSelectedImage(file)
      }
    },
    []
  )

  if (!myProfile) {
    return null
  }

  return (
    <nav className="navbar navbar-dark bg-primary fixed-top">
      <Link to="/">
        <div className="linknavbar">Cards</div>
      </Link>

      <div>
        <label className="mr-2 text-white">
          <img
            alt={myProfile.name}
            src={myProfile.picture}
            className="avatar clickable"
            onClick={showUpdateProfileModal}
          />
        </label>
        <button className="btn btn-dark" onClick={signOut}>
          Sign Out
        </button>

        <Modal
          fade
          toggle={handleCloseUpdateProfileModal}
          isOpen={modalUpdateProfileOpen}
        >
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
                <FormText color="muted">Please choose your new avatar</FormText>
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
              <Button color="secondary" onClick={handleCloseUpdateProfileModal}>
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={!selectedImage}
                onClick={handleSave}
              >
                Save
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Modal>
      </div>
    </nav>
  )
}

export default NavBar
