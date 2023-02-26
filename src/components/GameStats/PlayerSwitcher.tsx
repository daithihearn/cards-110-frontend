import { useSnackbar } from "notistack"
import { useCallback, useEffect, useState } from "react"
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from "reactstrap"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { getMyProfile } from "../../caches/MyProfileSlice"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { PlayerProfile } from "../../model/Player"
import StatsService from "../../services/StatsService"

const PlayerSwitcher: React.FC = () => {
    const dispatch = useAppDispatch()
    const myProfile = useAppSelector(getMyProfile)
    const players = useAppSelector(getPlayerProfiles)
    const [showDropdown, setShowDropdown] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState<PlayerProfile>()
    const { enqueueSnackbar } = useSnackbar()

    const toggleDropdown = useCallback(
        () => setShowDropdown(!showDropdown),
        [showDropdown],
    )

    useEffect(() => {
        const me = players.find(p => p.id === myProfile.id)
        if (me) setCurrentPlayer(me)
    }, [players, myProfile])

    useEffect(() => {
        if (currentPlayer)
            dispatch(StatsService.gameStatsForPlayer(currentPlayer.id)).catch(
                e =>
                    enqueueSnackbar(
                        `Failed to get game stats for player ${currentPlayer.name}`,
                        { variant: "error" },
                    ),
            )
    }, [currentPlayer])

    return (
        <Dropdown isOpen={showDropdown} toggle={toggleDropdown}>
            <DropdownToggle data-toggle="dropdown" tag="span">
                <img
                    alt={currentPlayer ? currentPlayer.name : ""}
                    src={currentPlayer ? currentPlayer.picture : ""}
                    className="avatar clickable"
                    onClick={() => setShowDropdown(true)}
                />
            </DropdownToggle>
            <DropdownMenu
                container="body"
                style={{ maxHeight: "20em", overflow: "scroll" }}>
                {players.map(p => {
                    return (
                        <DropdownItem
                            key={p.id}
                            onClick={() => setCurrentPlayer(p)}>
                            {p.name}
                        </DropdownItem>
                    )
                })}
            </DropdownMenu>
        </Dropdown>
    )
}

export default PlayerSwitcher
