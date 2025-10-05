import axios from 'axios';

const Cookie = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGQ3OTZmM2E1YWMyOGE4OThiY2NhNTciLCJpYXQiOjE3NTg5NTk1MTB9.IyxQDK-LxHin2ZXKTrP3paikH9yfoJ-VNyBSNYGFehc; Path=/;';

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