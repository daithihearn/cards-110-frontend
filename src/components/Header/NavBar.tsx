import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth0 } from "@auth0/auth0-react"

import { useAppDispatch, useAppSelector } from "caches/hooks"

import ProfilePictureEditor from "components/Avatar/ProfilePictureEditor"
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

const NavBar = () => {
    const { logout } = useAuth0()

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const [modalDeleteGameOpen, updateModalDeleteGameOpen] = useState(false)
    const isGameActive = useAppSelector(getIsGameActive)
    const gameId = useAppSelector(state => state.game.id)
    const iamAdmin = useAppSelector(getIamAdmin)
    const [showEditAvatar, setShowEditAvatar] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [modalLeaderboard, updateModalLeaderboard] = useState(false)

    const deleteGame = useCallback(() => {
        if (!gameId) {
            return
        }
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

    const toggleEditAvatar = useCallback(() => {
        setShowEditAvatar(!showEditAvatar)
        handleClose()
    }, [showEditAvatar])

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
                                <HomeButton />
                            </IconButton>
                        </Grid>

                        <Grid item xs={6}>
                            <Box display="flex" justifyContent="flex-end">
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={handleClick}>
                                    <MenuButton />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}>
                                    <MenuItem onClick={toggleEditAvatar}>
                                        Change Avatar
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

            <ProfilePictureEditor
                show={showEditAvatar}
                callback={toggleEditAvatar}
            />

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
                    <Button color="primary" onClick={deleteGame}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default NavBar
