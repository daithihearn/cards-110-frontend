import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth0 } from "@auth0/auth0-react"

import { useAppSelector } from "caches/hooks"
import { getMyProfile } from "caches/MyProfileSlice"

import ProfilePictureEditor from "components/Avatar/ProfilePictureEditor"
import GameHeader from "components/Game/GameHeader"
import {
    Card,
    CardBody,
    CardGroup,
    CardHeader,
    Col,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Modal,
    ModalBody,
    Row,
} from "reactstrap"
import { getIsGameActive } from "caches/GameSlice"
import Leaderboard from "components/Leaderboard/Leaderboard"
import MenuButton from "assets/icons/Menu.svg"

const NavBar = () => {
    const { logout } = useAuth0()

    const navigate = useNavigate()

    const isGameActive = useAppSelector(getIsGameActive)
    const [showEditAvatar, setShowEditAvatar] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [modalLeaderboard, updateModalLeaderboard] = useState(false)

    const toggleDropdown = useCallback(
        () => setShowDropdown(!showDropdown),
        [showDropdown],
    )

    const toggleLeaderboardModal = useCallback(
        () => updateModalLeaderboard(!modalLeaderboard),
        [modalLeaderboard],
    )

    const toggleEditAvatar = useCallback(
        () => setShowEditAvatar(!showEditAvatar),
        [showEditAvatar],
    )

    const navigateHome = () => navigate("/")

    const myProfile = useAppSelector(getMyProfile)

    const signOut = () => logout()

    if (!myProfile) {
        return null
    }

    return (
        <nav className="custom-navbar bg-primary fixed-top">
            <Container
                className="navBarInner"
                fluid
                xs="2"
                sm="2"
                md="2"
                lg="2"
                xl="2">
                <Row>
                    <Col className="nav-col">
                        <Dropdown
                            isOpen={showDropdown}
                            toggle={toggleDropdown}
                            className="custom-dropdown"
                            direction="down">
                            <DropdownToggle data-toggle="dropdown" tag="span">
                                <img
                                    src={MenuButton}
                                    className="nav-menu-button clickable"
                                    onClick={() => setShowDropdown(true)}
                                />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={navigateHome}>
                                    Home
                                </DropdownItem>
                                <DropdownItem onClick={toggleEditAvatar}>
                                    Change Avatar
                                </DropdownItem>
                                {isGameActive && (
                                    <DropdownItem
                                        onClick={toggleLeaderboardModal}>
                                        Game Stats
                                    </DropdownItem>
                                )}
                                <DropdownItem onClick={signOut}>
                                    Sign Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>

                    <Col className="nav-col">
                        {isGameActive && <GameHeader />}
                    </Col>
                </Row>
            </Container>

            <ProfilePictureEditor
                show={showEditAvatar}
                callback={toggleEditAvatar}
            />

            <Modal
                fade={true}
                size="lg"
                toggle={toggleLeaderboardModal}
                isOpen={modalLeaderboard}>
                <ModalBody className="gameModalBody">
                    <CardGroup>
                        <Card className="data-card">
                            <CardHeader tag="h2">Leaderboard</CardHeader>
                            <CardBody>
                                <Leaderboard />
                            </CardBody>
                        </Card>
                    </CardGroup>
                </ModalBody>
            </Modal>
        </nav>
    )
}

export default NavBar
