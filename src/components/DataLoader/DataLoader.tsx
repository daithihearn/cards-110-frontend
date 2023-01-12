import GameService from "../../services/GameService"
import StatsService from "../../services/StatsService"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { getMyProfile } from "../../caches/MyProfileSlice"
import { useEffect } from "react"
import { useSnackbar } from "notistack"

const DataLoader = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const myProfile = useAppSelector(getMyProfile)

  useEffect(() => {
    if (myProfile.isAdmin)
      dispatch(GameService.getAllPlayers()).catch((e: Error) =>
        enqueueSnackbar(e.message, { variant: "error" })
      )

    dispatch(GameService.getAll())

    dispatch(StatsService.gameStatsForPlayer()).catch((e: Error) =>
      enqueueSnackbar(e.message, { variant: "error" })
    )
  }, [myProfile])

  return null
}

export default DataLoader
