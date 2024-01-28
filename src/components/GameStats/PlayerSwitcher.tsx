import { useEffect, useMemo, useState } from "react"
import {
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Avatar,
} from "@mui/material"
import { PlayerProfile } from "model/Player"
import { FormatName } from "utils/FormattingUtils"
import { useProfiles } from "components/Hooks/useProfiles"

interface Props {
    onChange: (player: PlayerProfile) => void
}

const PlayerSwitcher: React.FC<Props> = ({ onChange }) => {
    const { myProfile, allProfiles } = useProfiles()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [currentPlayer, setCurrentPlayer] = useState<PlayerProfile>()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const sortedPlayers = useMemo(
        () =>
            [...allProfiles].sort((a, b) => {
                const aDate = new Date(a.lastAccess)
                const bDate = new Date(b.lastAccess)
                if (aDate === bDate) return 0
                return aDate > bDate ? -1 : 1
            }),
        [allProfiles],
    )

    useEffect(() => {
        const me = allProfiles.find(p => p.id === myProfile?.id)
        if (me) setCurrentPlayer(me)
    }, [sortedPlayers, myProfile])

    useEffect(() => {
        if (currentPlayer) onChange(currentPlayer)
    }, [currentPlayer])

    return (
        <>
            <IconButton
                edge="end"
                color="inherit"
                aria-haspopup="true"
                onClick={handleClick}>
                <Avatar
                    alt={currentPlayer ? currentPlayer.name : ""}
                    src={currentPlayer ? currentPlayer.picture : ""}
                    className="clickable"
                />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: "20em",
                        overflow: "scroll",
                    },
                }}>
                {sortedPlayers.map(p => {
                    return (
                        <MenuItem
                            key={p.id}
                            onClick={() => {
                                setCurrentPlayer(p)
                                handleClose()
                            }}>
                            <ListItemIcon>
                                <Avatar src={p.picture} />
                            </ListItemIcon>
                            <ListItemText primary={FormatName(p.name)} />
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    )
}

export default PlayerSwitcher
