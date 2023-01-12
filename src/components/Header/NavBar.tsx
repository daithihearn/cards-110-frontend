import React, { useState } from "react"
import { Link } from "react-router-dom"

import { useAuth0 } from "@auth0/auth0-react"

import { useAppSelector } from "../../caches/hooks"
import { getMyProfile } from "../../caches/MyProfileSlice"

import ProfilePictureEditor from "../Avatar/ProfilePictureEditor"
import GameHeader from "../Game/GameHeader"
import { Col, Container, Row } from "reactstrap"
import LeaderboardModal from "../Leaderboard/LeaderboardModal"
import { getHasGame } from "../../caches/GameSlice"

const NavBar = () => {
  const { logout } = useAuth0()

  const hasGame = useAppSelector(getHasGame)
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
      <Container fluid className="nav-container">
        <Row>
          <Col
            className="nav-col"
            sm={{
              size: 1,
            }}
          >
            <Link to="/">
              <div className="linknavbar">Cards</div>
            </Link>
          </Col>
          <Col
            className="nav-col"
            sm={{
              size: 1,
            }}
          >
            {hasGame && <LeaderboardModal />}
          </Col>
          <Col
            className="nav-col"
            sm={{
              size: 4,
            }}
          >
            {hasGame && <GameHeader />}
          </Col>
          <Col
            className="nav-col"
            sm={{
              size: 1,
            }}
          >
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
          <Col
            className="nav-col"
            sm={{
              size: 1,
            }}
          >
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
