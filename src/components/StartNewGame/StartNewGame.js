import React, { useState } from "react"

import { useSelector, useDispatch } from "react-redux"
import GameService from "../../services/GameService"
import DataTable from "react-data-table-component"

import {
  Label,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Input,
  Card,
  CardBody,
  CardGroup,
} from "reactstrap"

import parseError from "../../utils/ErrorUtils"
import { useAuth0 } from "@auth0/auth0-react"
import { triggerBounceMessage } from "../../constants"

const StartNewGame = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [newGameName, updateNewGameName] = useState("")
  const allPlayers = useSelector((state) => state.players.players)

  const [selectedPlayers, updateSelectedPlayers] = useState([])
  const dispatch = useDispatch()

  const togglePlayer = (rows) => {
    updateSelectedPlayers(rows.selectedRows)
  }

  const startGame = (e) => {
    e.preventDefault()
    if (selectedPlayers.length < 1) {
      dispatch({
        type: "snackbar/message",
        payload: {
          type: "error",
          message: "You must select at least one player",
        },
      })
      return
    }
    if (newGameName === "") {
      dispatch({
        type: "snackbar/message",
        payload: {
          type: "error",
          message: "You must provide a name for the game",
        },
      })
      return
    }

    let payload = {
      players: selectedPlayers.map((p) => p.id),
      name: newGameName,
    }

    getAccessTokenSilently()
      .then((accessToken) => {
        GameService.put(payload, accessToken)
          .then((response) => {
            updateNewGameName("")
            dispatch({ type: "myGames/addGame", payload: response.data })
            dispatch({
              type: "snackbar/message",
              payload: { type: "info", message: "Game started successfully" },
            })
          })
          .catch((error) => {
            if (error.message === triggerBounceMessage) {
              return
            }
            dispatch({
              type: "snackbar/message",
              payload: { type: "error", message: parseError(error) },
            })
          })
      })
      .catch((error) => {
        dispatch({
          type: "snackbar/message",
          payload: { type: "error", message: parseError(error) },
        })
      })
  }

  const handleNameChange = (e) => {
    updateNewGameName(e.target.value)
  }

  const columns = [
    {
      name: "Avatar",
      cell: (row) => (
        <img alt="Image Preview" src={row.picture} className="avatar" />
      ),
    },
    {
      name: "Player",
      selector: "name",
      sortable: true,
    },
  ]

  return (
    <CardGroup>
      <Card color="secondary">
        <CardBody>
          <h1>Start a new game</h1>
        </CardBody>
        <CardBody>
          <FormGroup>
            <h3 colSpan="2">Players</h3>

            <DataTable
              noHeader
              pagination
              theme="solarized"
              data={allPlayers}
              columns={columns}
              highlightOnHover
              selectableRows
              Clicked
              onSelectedRowsChange={togglePlayer}
            />

            <Form onSubmit={startGame}>
              <FormGroup>
                <Label for="exampleText">Name</Label>
                <Input
                  type="input"
                  className="name"
                  id="newGameName"
                  name="newGameName"
                  placeholder="Give the game a name"
                  autoComplete="off"
                  onChange={handleNameChange}
                  value={newGameName}
                  disabled={selectedPlayers.length < 2}
                  required
                />
              </FormGroup>
              <ButtonGroup>
                <Button
                  size="lg"
                  color="primary"
                  type="submit"
                  onClick={startGame}
                  disabled={
                    selectedPlayers.length < 2 ||
                    (!newGameName && newGameName === "")
                  }
                >
                  Start Game
                </Button>
              </ButtonGroup>
            </Form>
          </FormGroup>
        </CardBody>
      </Card>
    </CardGroup>
  )
}

export default StartNewGame
