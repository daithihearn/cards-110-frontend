import React, { useState } from 'react'
import { Link } from "react-router-dom"
import profileService from '../../services/ProfileService'
import { useAuth0 } from '@auth0/auth0-react'
import parseError from '../../utils/ErrorUtils'

import { Col, Modal, ModalBody, ModalHeader, ModalFooter, Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'

const NavBar = () => {

    const dispatch = useDispatch()
    const { isAuthenticated, getAccessTokenSilently } = useAuth0()
    const { logout, loginWithRedirect } = useAuth0()


    const myProfile = useSelector(state => state.myProfile)
    if (!myProfile) { return null }

    const [modalUpdateProfileOpen, updateModalUpdateProfileOpen] = useState(false)

    const signOut = () => {
        logout({ returnTo: window.location.origin })
        clearGame()
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

            getAccessTokenSilently().then(accessToken => {


                let reader = new FileReader();

                reader.onloadend = () => {

                    profileService.updateProfile({ name: myProfile.name, picture: reader.result, forceUpdate: true }, accessToken).then(profile => {
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
                }

                reader.readAsDataURL(file);

            }).catch(error => {
                dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
            })
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
                                    <Label for="newAvatar" sm={2}>Avatar</Label>
                                    <Col sm={10}>
                                        <Input type="file" name="newAvatar" id="newAvatar" onChange={handleNewAvatarSelection} multiple={false} />
                                        <FormText color="muted">
                                            Please choose your new avatar
                                        </FormText>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="secondary" onClick={handleCloseUpdateProfileModal}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
            }
        </nav>
    )
}

export default NavBar;
