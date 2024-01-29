import React, { useEffect } from "react"
import shuffleAudioFile from "assets/sounds/shuffle.ogg"
import playCardAudioFile from "assets/sounds/play_card.ogg"
import callAudioFile from "assets/sounds/call.ogg"
import passAudioFile from "assets/sounds/pass.ogg"
import { useAppSelector } from "caches/hooks"
import { getEvent } from "caches/GameSlice"
import { Event } from "model/Events"

const shuffleAudio = new Audio(shuffleAudioFile)
const playCardAudio = new Audio(playCardAudioFile)
const callAudio = new Audio(callAudioFile)
const passAudio = new Audio(passAudioFile)

const shuffleSound = () => {
    shuffleAudio
        .play()
        .catch(() => console.error("Error playing shuffle sound!"))
}

const playCardSound = () => {
    playCardAudio
        .play()
        .catch(() => console.error("Error playing play card sound!"))
}

const callSound = () => {
    callAudio.play().catch(() => console.error("Error playing call sound!"))
}

const passSound = () => {
    passAudio.play().catch(() => console.error("Error playing pass sound!"))
}

export const SoundEffects = () => {
    const event = useAppSelector(getEvent)

    useEffect(() => {
        switch (event) {
            case Event.Unknown:
                break
            case Event.BuyCards:
                shuffleSound()
                break
            case Event.CardPlayed:
            case Event.HandEnd:
                playCardSound()
                break
            case Event.Call:
                callSound()
                break
            case Event.Pass:
                passSound()
                break
        }
    }, [event])

    return null
}
