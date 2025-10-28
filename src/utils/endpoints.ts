import environment from "../environments/environment";

const currentEnvironment: 'local' | 'production' = 'local';

function getBaseURL() {
    if (currentEnvironment === 'local') return environment.BASE_URL;
}

const endpoints = {
    GET_HABIT_METADATA: `${getBaseURL()}/habit/metadata`,
    SIGNUP: `${getBaseURL()}/signup`,
    LOGIN: `${getBaseURL()}/login`,
    LOGOUT: `${getBaseURL()}/logout`,
    CREATE_HABIT: `${getBaseURL()}/habit/create`,
    GET_HABIT_ANALYTICS: `${getBaseURL()}/get-habit-analytics`,
    GET_HABITS: `${getBaseURL()}/get-habits`,
    VIEW_HABIT: `${getBaseURL()}/habit/view`,
    GET_HABIT_JOURNEY: `${getBaseURL()}/habit/journey`,
    LOG_HABIT: `${getBaseURL()}/habit/logHabit`,
    AUTHENTICATE_USER: `${getBaseURL()}/auth/check`,
    CLAIM_REWARD: `${getBaseURL()}/reward/redeem/habit`,
    GENERAL_REWARDS: `${getBaseURL()}/general/rewards`,
    REDEEMED_REWARDS: `${getBaseURL()}/view/redeemed/rewards`,
    CREATE_REWARD: `${getBaseURL()}/reward/create`,
    REDEEM_GENERAL_REWARD: `${getBaseURL()}/reward/redeem/general`,
    DELETE_HABIT: `${getBaseURL()}/habit/delete`,
    MAKE_HABIT_INACTIVE: `${getBaseURL()}/habit/change/status`,
}

export default endpoints;
