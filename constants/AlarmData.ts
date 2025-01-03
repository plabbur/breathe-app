export interface AlarmType {
    id: number;
    name: string;
    audio: string;
}

export const ALARM_DATA: AlarmType[] = [
    {   id: 1,
        name: "chirp",
        audio: "chirp.mp3",
    },
    {   id: 2,
        name: "departure",
        audio: "departure.mp3"
    },
    {   id: 3,
        name: "future",
        audio: "future.mp3"
    },
    {   id: 4,
        name: "peace",
        audio: "peace.mp3"
    },
    {   id: 5,
        name: "radial",
        audio: "radial.mp3"
    },
    {   id: 6,
        name: "reflection",
        audio: "reflection.mp3",
    },
]

export const AUDIO_FILES: {[key: string]: any} = {
    "chirp.mp3": require("@/assets/audio/alarms/chirp.mp3"),
    "departure.mp3": require("@/assets/audio/alarms/departure.mp3"),
    "future.mp3": require("@/assets/audio/alarms/future.mp3"),
    "peace.mp3": require("@/assets/audio/alarms/peace.mp3"),
    "radial.mp3": require("@/assets/audio/alarms/radial.mp3"),
    "reflection.mp3": require("@/assets/audio/alarms/reflection.mp3"),
}