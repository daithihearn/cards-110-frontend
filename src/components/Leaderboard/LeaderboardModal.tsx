import { useCallback, useState } from "react"

import { Modal, ModalBody, Button } from "reactstrap"

import Leaderboard from "../Leaderboard/Leaderboard"

const LeaderboardModal = () => {
  const [modalLeaderboard, updateModalLeaderboard] = useState(false)

  const toggleLeaderboardModal = useCallback(
    () => updateModalLeaderboard(!modalLeaderboard),
    [modalLeaderboard]
  )

  return (
    <>
      <Button
        type="button"
        className="float-left leaderboard-button"
        color="info"
        onClick={toggleLeaderboardModal}
      >
        <img
          className="thumbnail_size_extra_small"
          alt="Leaderboard"
          src="/assets/img/leaderboard.png"
        />
      </Button>
      <Modal
        fade={true}
        size="lg"
        toggle={toggleLeaderboardModal}
        isOpen={modalLeaderboard}
      >
        <ModalBody className="gameModalBody">
          <Leaderboard />
        </ModalBody>
      </Modal>
    </>
  )
}

export default LeaderboardModal