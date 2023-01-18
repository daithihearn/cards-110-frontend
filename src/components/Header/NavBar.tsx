import React, { useState } from "react"
import { Link } from "react-router-dom"

import { useAuth0 } from "@auth0/auth0-react"

import { useAppSelector } from "../../caches/hooks"
import { getMyProfile } from "../../caches/MyProfileSlice"

import ProfilePictureEditor from "../Avatar/ProfilePictureEditor"
import GameHeader from "../Game/GameHeader"
import { Col, Container, Row } from "reactstrap"
import LeaderboardModal from "../Leaderboard/LeaderboardModal"
import { getIsGameActive } from "../../caches/GameSlice"

const NavBar = () => {
    const { logout } = useAuth0()

    const isGameActive = useAppSelector(getIsGameActive)
    const [showEditAvatar, setShowEditAvatar] = useState(false)

    const myProfile = useAppSelector(getMyProfile)

    const signOut = () => logout({ returnTo: window.location.origin })

    const showUpdateProfileModal = () => {
        setShowEditAvatar(true)
    }

    if (!myProfile) {
        return null
    }

    return (
        <nav className="custom-navbar bg-primary fixed-top">
            <Container fluid xs="5" sm="5" md="5" lg="5" xl="5">
                <Row>
                    <Col className="nav-col">
                        <Link to="/">
                            <div className="linknavbar">Cards</div>
                        </Link>
                    </Col>
                    <Col className="nav-col">
                        {isGameActive && <LeaderboardModal />}
                    </Col>
                    <Col className="nav-col">
                        {isGameActive && <GameHeader />}
                    </Col>
                    <Col className="nav-col">
                        <div>
                            <label className="mr-2 text-white">
                                <img
                                    alt={myProfile.name}
                                    src={myProfile.picture}
                                    className="avatar clickable"
                                    onClick={showUpdateProfileModal}
                                />
                            </label>

                            <ProfilePictureEditor
                                show={showEditAvatar}
                                callback={() => setShowEditAvatar(false)}
                            />
                        </div>
                    </Col>
                    <Col className="nav-col">
                        <button className="btn btn-dark" onClick={signOut}>
                            Sign Out
                        </button>
                    </Col>
                </Row>
            </Container>
        </nav>
    )
}

export default NavBar
