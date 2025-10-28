import axios from 'axios';

export const callGetApi = (
    api,
    params,
    apiConfig?: {},
) => {
    return axios
        .get(api, {
            params: params,
            withCredentials: true,
            ...apiConfig
        })
        .then((response: any) => response)
};

export const callSignupApi = (
    api,
    body,
    apiConfig = {}
) => {
    return axios
        .post(api, body, apiConfig)
        .then((response: any) => response)
}

export const callPatchApi = (
    api,
    body,
    apiConfig = {}
) => {
    return axios
        .patch(api, body, {
            withCredentials: true,
            ...apiConfig
        })
        .then((response: any) => response)
}

export const callPostApi = (
    api,
    body,
    apiConfig = {}
) => {
    return axios
        .post(
            api,
            body, {
            withCredentials: true,
            ...apiConfig
        }
        )
        .then((response: any) => response)
}

export const callDeleteApi = (
    api,
    params?: any,
    apiConfig?: any
) => {
    return axios
        .delete(api, {
            params: params,
            withCredentials: true,
            ...apiConfig
        })
        .then((response: any) => response)
}