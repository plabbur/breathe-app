import uuid from 'react-native-uuid';
import { Meditation } from '@/storage';
import { useMeditations } from '@/context/MeditationsContext';

interface MeditationType {
    id: any, 
    moodBefore: number | null, 
    entryBefore: string, 
    date: Date, 
    moodAfter: number | null, 
    entryAfter: string, 
    duration: number, 
    breathCount: number, 
    moodFigure: number | null,
}

const {meditations, fetchMeditations, saveMeditations} = useMeditations();

const getBreathCount = (duration: number) => {
    return duration / 19;
}

const getMoodFigure = (moodBefore: number, moodAfter: number) => {
    if (moodBefore && moodAfter) {
        if (moodBefore > moodAfter) {
             return (-100 * (moodBefore / moodAfter));
        } else {
            return (100 * (moodAfter / moodBefore));
        }
    } else {
        return null;
    }
} 

export const ENTRIES_BEFORE = [
    "I felt tired and drained after a long day at work. It was hard to shake off the stress, and I couldn't focus on anything meaningful.",
    "I woke up feeling a bit anxious about tomorrow's presentation. My thoughts were racing, and I found it difficult to calm down.",
    "The day started off overwhelming, with too many tasks piling up. I felt like I was constantly falling behind.",
    "Struggling to focus today. My mind kept drifting to everything I need to get done, and it felt impossible to find clarity.",
    "I spent the day reflecting on some recent challenges at work. It left me feeling frustrated and stuck.",
    "Restlessness seemed to take over. I couldn’t seem to relax, no matter how hard I tried.",
    "Noticing a lot of tension in my body today, especially in my shoulders. I hope to release some of it through meditation.",
    "Today was full of worries about things beyond my control. It left me feeling mentally drained.",
    "Feeling okay, but there’s a nagging sense that something is off. I can’t quite put my finger on it.",
    "A little stressed about an upcoming deadline, but I’m managing it as best as I can for now."
];

export const ENTRIES_AFTER = [
    "After meditating, I feel refreshed and calm. It's like the weight on my chest has been lifted, and I can breathe more deeply.",
    "I feel much more centered and optimistic about the day ahead. The clarity I gained is exactly what I needed.",
    "Taking a moment to meditate reminded me of how much I have to be grateful for. I feel lighter and more at peace.",
    "I’m ending this session feeling energized and motivated. It’s amazing how a few moments of focus can shift my mindset.",
    "Much more focused now and ready to tackle tomorrow with a clear head. Meditation helped me sort through my thoughts.",
    "I feel at peace with where I am and what lies ahead. There’s a calm confidence that wasn’t there before.",
    "Meditating helped me feel proud of the progress I’ve made recently. It’s a good reminder to celebrate small wins.",
    "I feel so relaxed and happy to end the day on a good note. It feels like a perfect reset for my mind and body.",
    "Hopeful and ready for the challenges ahead. The meditation helped me see things from a more balanced perspective.",
    "I’m calmer and more present in the moment. It feels like I’ve regained control of my emotions and thoughts."
];


export const EXAMPLE_MEDITATION_DATA: MeditationType[] = [
    {id: uuid.v4(), moodBefore: 1, entryBefore: "Today was okay I guess. Didn't do much.", date: new Date(2023, 12, 0), moodAfter: 4, entryAfter: "I'm feeling better", duration: 432, breathCount: getBreathCount(432), moodFigure: getMoodFigure(1, 4)}
]

const generateRandomMeditation = (date: Date): MeditationType => {
    const moodBefore = Math.floor(Math.random() * 5) + 1; // Mood between 1 and 5
    const moodAfter = Math.min(moodBefore + Math.floor(Math.random() * (5 - moodBefore + 1)), 5); // Ensure moodAfter >= moodBefore
    const duration = Math.floor(Math.random() * (2000 - 45 + 1)) + 45; // Duration between 45 and 2000
    const breathCount = getBreathCount(duration);
    const moodFigure = getMoodFigure(moodBefore, moodAfter);

    return {
        id: uuid.v4(),
        moodBefore,
        entryBefore: ENTRIES_BEFORE[Math.floor(Math.random() * 10) - 1],
        date,
        moodAfter,
        entryAfter: ENTRIES_AFTER[Math.floor(Math.random() * 10) - 1],
        duration,
        breathCount,
        moodFigure,
    };
};


const saveSampleMeditation = async (id, moodBefore, entryBefore, date, moodAfter, entryAfter, duration, breathCount, moodFigure) => {
  const newMeditation = new Meditation(id, moodBefore, entryBefore, date, moodAfter, entryAfter, duration, breathCount, moodFigure);
  meditations?.push(newMeditation);
  await saveMeditations(meditations);
  console.log("pushed meditation: ", meditations);
}

export const generateRandomMeditationData = async () => {
    const startDate = new Date(2024, 1, 1); // December 1, 2024
    const endDate = new Date(2025, 0, 15); // January 15, 2025
    let currentDate = startDate;

    while (currentDate <= endDate) {
        if (Math.random() > 0.2) { // Skip about 20% of days randomly
            EXAMPLE_MEDITATION_DATA.push(generateRandomMeditation(new Date(currentDate)));
        }
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
    
    for (let i = 0; i < EXAMPLE_MEDITATION_DATA.length; i++) {
        await saveSampleMeditation(EXAMPLE_MEDITATION_DATA[i].id, EXAMPLE_MEDITATION_DATA[i].moodBefore, EXAMPLE_MEDITATION_DATA[i].entryBefore, EXAMPLE_MEDITATION_DATA[i].date, EXAMPLE_MEDITATION_DATA[i].moodAfter, EXAMPLE_MEDITATION_DATA[i].entryAfter, EXAMPLE_MEDITATION_DATA[i].duration, EXAMPLE_MEDITATION_DATA[i].breathCount, EXAMPLE_MEDITATION_DATA[i].moodFigure)
    }
}