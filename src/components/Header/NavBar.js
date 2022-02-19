import React, { useState } from 'react'
import { Link } from "react-router-dom"
import profileService from '../../services/ProfileService'
import { useAuth0 } from '@auth0/auth0-react'
import parseError from '../../utils/ErrorUtils'
import AvatarEditor from 'react-avatar-editor'

import { Col, Modal, ModalBody, ModalHeader, ModalFooter, Button, Form, FormGroup, FormText, Label, Input, ButtonGroup } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'

const NavBar = () => {

    const dispatch = useDispatch()
    const { isAuthenticated, getAccessTokenSilently } = useAuth0()
    const { logout, loginWithRedirect } = useAuth0()


    const myProfile = useSelector(state => state.myProfile)
    if (!myProfile) { return null }

    const [modalUpdateProfileOpen, updateModalUpdateProfileOpen] = useState(false)
    const [selectedImage, updateSelectedImage] = useState(myProfile.picture)
    const [scale, updateScale] = useState(1.2)
    const [editor, setEditorRef] = useState(null)

    const signOut = () => {
        logout({ returnTo: window.location.origin })
        clearGame()
    }

    const handleScale = e => {
        const newScale = parseFloat(e.target.value)
        updateScale(newScale)
    }

    const handleSave = () => {
        const canvasScaled = editor.getImageScaledToCanvas()
        const croppedImg = canvasScaled.toDataURL()

        getAccessTokenSilently().then(accessToken => {

            profileService.updateProfile({ name: myProfile.name, picture: croppedImg, forceUpdate: true }, accessToken).then(profile => {
                dispatch({
                    type: 'myProfile/update', payload: {
                        id: myProfile.id,
                        name: myProfile.name,
                        picture: profile.data.picture,
                        isPlayer: myProfile.isPlayer,
                        isAdmin: myProfile.isAdmin,
                        accessToken: accessToken
                    }
                })
            })
            updateModalUpdateProfileOpen(false)

        }).catch(error => {
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }

    const clearGame = () => {
        dispatch({ type: 'game/exit' })
    }

    const showUpdateProfileModal = () => {
        updateModalUpdateProfileOpen(true)
    }

    const handleCloseUpdateProfileModal = () => {
        updateModalUpdateProfileOpen(false)
    }

    const handleNewAvatarSelection = (event) => {

        let file = event.target.files[0];

        if (file.type.includes("image/")) {

            let reader = new FileReader()

            reader.onloadend = () => {
                updateSelectedImage(reader.result)
            }

            reader.readAsDataURL(file)


        } else {
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: "Invalid File Type" } })
        }
    }

    return (
        <nav className="navbar navbar-dark bg-primary fixed-top">
            <Link to="/"><div className="linknavbar">Cards</div></Link>
            { !isAuthenticated ?
                <button className="btn btn-dark" onClick={loginWithRedirect}>Sign In</button>
                :
                <div>
                    <label className="mr-2 text-white"><img alt={myProfile.name} src={myProfile.picture} className="avatar clickable" onClick={showUpdateProfileModal} /></label>
                    <button className="btn btn-dark" onClick={signOut}>Sign Out</button>

                    <Modal fade toggle={handleCloseUpdateProfileModal} isOpen={modalUpdateProfileOpen}>
                        <ModalBody>

                            <Form>
                                <FormGroup row>
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
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="newAvatar" sm={2}>Avatar</Label>
                                    <Col sm={10}>
                                        <Input type="file" accept="image/*" name="newAvatar" id="newAvatar" onChange={handleNewAvatarSelection} multiple={false} />
                                        <FormText color="muted">
                                            Please choose your new avatar
                                            </FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="scale">Zoom</Label>
                                    <Input
                                        name="scale"
                                        type="range"
                                        onChange={handleScale}
                                        min="1"
                                        max="2"
                                        step="0.01"
                                        defaultValue="1.2"
                                    />
                                </FormGroup>
                            </Form>
                        </ModalBody>

                        <ModalFooter>
                            <ButtonGroup size="lg">
                                <Button color="secondary" onClick={handleCloseUpdateProfileModal}>
                                    Cancel
                                </Button>
                                <Button color="primary" onClick={handleSave}>
                                    Save
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </Modal>
                </div>
            }
        </nav>
    )
}

export default NavBar;
