const Constants = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    difficultyToPointsMap: {
        "easy": 10,
        "medium": 20,
        "hard": 30,
        "expert": 40
    },
}

export const rewardCategories = [
    { text: "Food Treats", value: "food-treats", icon: '🍕', color: 'bg-red-500/20 text-red-400' },
    { text: "Entertainment", value: "entertainment", icon: '🎬', color: 'bg-blue-500/20 text-blue-400' },
    { text: "Shopping", value: "shopping", icon: '🛍️', color: 'bg-purple-500/20 text-purple-400' },
    { text: "Experiences", value: "experiences", icon: '🎯', color: 'bg-green-500/20 text-green-400' },
    { text: "Self Care", value: "self-care", icon: '💆', color: 'bg-pink-500/20 text-pink-400' },
    { text: "Other", value: "other", icon: '🎁', color: 'bg-orange-500/20 text-orange-400' }
];

export const defaultRewardImageUrl = '/images/reward-placeholder.jpg';
export default Constants;