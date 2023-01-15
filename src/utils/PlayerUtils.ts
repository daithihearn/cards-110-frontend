import { Player, PlayerProfile, Scorable } from "../model/Player"

export const compareScore = (a: Scorable, b: Scorable) => {
    let comparison = 0
    if (b.score > a.score) {
        comparison = 1
    } else if (b.score < a.score) {
        comparison = -1
    }
    return comparison
}

export const compareTeamIds = (a: Player, b: Player) => {
    let comparison = 0
    if (b.teamId > a.teamId) {
        comparison = 1
    } else if (b.teamId < a.teamId) {
        comparison = -1
    }
    return comparison
}

export const doPlayersMatchProfiles = (
    players: Player[],
    playerProfiles: PlayerProfile[],
) => {
    if (players.length !== playerProfiles.length) {
        return false
    }

    playerProfiles.forEach(profile => {
        if (!players.find(p => p.id === profile.id)) {
            return false
        }
    })

    return true
}
