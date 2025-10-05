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
    GET_HABITS: `${getBaseURL()}/get-habits`
}

export default endpoints;