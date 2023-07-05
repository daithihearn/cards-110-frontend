import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth0 } from "@auth0/auth0-react"

import { useAppDispatch, useAppSelector } from "caches/hooks"

import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
} from "@mui/material"
import { getIsGameActive, getIamAdmin } from "caches/GameSlice"
import Leaderboard from "components/Leaderboard/Leaderboard"
import MenuButton from "@mui/icons-material/Menu"
import HomeButton from "@mui/icons-material/Home"
import GameService from "services/GameService"
import { useSnackbar } from "notistack"
import parseError from "utils/ErrorUtils"
import Settings from "components/Settings/Settings"

const NavBar = () => {
    const { logout } = useAuth0()

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const [modalDeleteGameOpen, updateModalDeleteGameOpen] = useState(false)
    const isGameActive = useAppSelector(getIsGameActive)
    const gameId = useAppSelector(state => state.game.id)
    const iamAdmin = useAppSelector(getIamAdmin)
    const [showSettings, setShowSettings] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [modalLeaderboard, updateModalLeaderboard] = useState(false)

    const deleteGame = useCallback(() => {
        if (!gameId) {
            return
        }
        handleClose()
        handleCloseDeleteGameModal()

        dispatch(GameService.deleteGame(gameId))
            .then(() => {
                enqueueSnackbar("Game deleted")
                navigate("/")
            })
            .catch((e: Error) =>
                enqueueSnackbar(parseError(e), { variant: "error" }),
            )
    }, [dispatch, enqueueSnackbar, navigate, gameId])

    const showDeleteGameModal = () => {
        updateModalDeleteGameOpen(true)
        handleClose()
    }

    const handleCloseDeleteGameModal = useCallback(() => {
        updateModalDeleteGameOpen(false)
        handleClose()
    }, [updateModalDeleteGameOpen])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const toggleLeaderboardModal = useCallback(() => {
        updateModalLeaderboard(!modalLeaderboard)
        handleClose()
    }, [modalLeaderboard])

    const toggleSettings = useCallback(() => {
        setShowSettings(!showSettings)
        handleClose()
    }, [showSettings])

    const navigateHome = () => navigate("/")

    const signOut = () => logout()

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <Grid container alignItems="center">
                        <Grid item xs={6}>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={navigateHome}>
                                <HomeButton fontSize="large" />
                            </IconButton>
                        </Grid>

                        <Grid item xs={6}>
                            <Box display="flex" justifyContent="flex-end">
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={handleClick}>
                                    <MenuButton fontSize="large" />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}>
                                    <MenuItem onClick={toggleSettings}>
                                        Settings
                                    </MenuItem>
                                    {isGameActive && (
                                        <MenuItem
                                            onClick={toggleLeaderboardModal}>
                                            Game Stats
                                        </MenuItem>
                                    )}
                                    {isGameActive && iamAdmin && (
                                        <MenuItem onClick={showDeleteGameModal}>
                                            Delete Game
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={signOut}>
                                        Sign Out
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Toolbar />

            <Settings show={showSettings} callback={toggleSettings} />

            <Dialog
                fullScreen={false}
                maxWidth="md"
                fullWidth
                open={modalLeaderboard}
                onClose={toggleLeaderboardModal}>
                <DialogContent>
                    <Card>
                        <CardHeader title="Leaderboard" />
                        <CardContent>
                            <Leaderboard />
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
            <Dialog
                onClose={handleCloseDeleteGameModal}
                open={modalDeleteGameOpen}>
                <DialogTitle>You are about to Delete a game</DialogTitle>

                <DialogContent>
                    Are you sure you want to delete this game?
                </DialogContent>

                <DialogActions>
                    <Button
                        color="secondary"
                        onClick={handleCloseDeleteGameModal}>
                        No
                    </Button>
                    <Button color="secondary" onClick={deleteGame}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default NavBar
