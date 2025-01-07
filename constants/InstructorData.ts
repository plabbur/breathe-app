export interface InstructorType {
    id: number;
    name: string;
    inhale: string;
    hold: string;
    exhale: string;
}

export const INSTRUCTOR_DATA: InstructorType[] = [
    {   id: 1,
        name: "adam",
        inhale: "adam_inhale.mp3",
        hold: "adam_hold.mp3",
        exhale: "adam_exhale.mp3"
    },
    {   id: 2,
        name: "aria",
        inhale: "aria_inhale.mp3",
        hold: "aria_hold.mp3",
        exhale: "aria_exhale.mp3"
    },
    {   id: 3,
        name: "jay",
        inhale: "jay_inhale.mp3",
        hold: "jay_hold.mp3",
        exhale: "jay_exhale.mp3"
    },
    {   id: 4,
        name: "viraj",
        inhale: "viraj_inhale.mp3",
        hold: "viraj_hold.mp3",
        exhale: "viraj_exhale.mp3"
    },
]

export const INSTRUCTOR_AUDIO_FILES: {[key: string]: any} = {
    "adam_inhale.mp3": require("@/assets/audio/meditation_instructions/adam_inhale.mp3"),
    "adam_hold.mp3": require("@/assets/audio/meditation_instructions/adam_hold.mp3"),
    "adam_exhale.mp3": require("@/assets/audio/meditation_instructions/adam_exhale.mp3"),

    "aria_inhale.mp3": require("@/assets/audio/meditation_instructions/aria_inhale.mp3"),
    "aria_hold.mp3": require("@/assets/audio/meditation_instructions/aria_hold.mp3"),
    "aria_exhale.mp3": require("@/assets/audio/meditation_instructions/aria_exhale.mp3"),

    "jay_inhale.mp3": require("@/assets/audio/meditation_instructions/jay_inhale.mp3"),
    "jay_hold.mp3": require("@/assets/audio/meditation_instructions/jay_hold.mp3"),
    "jay_exhale.mp3": require("@/assets/audio/meditation_instructions/jay_exhale.mp3"),

    "viraj_inhale.mp3": require("@/assets/audio/meditation_instructions/viraj_inhale.mp3"),
    "viraj_hold.mp3": require("@/assets/audio/meditation_instructions/viraj_hold.mp3"),
    "viraj_exhale.mp3": require("@/assets/audio/meditation_instructions/viraj_exhale.mp3"),
}