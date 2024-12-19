import axios from "axios"

export const axiosInstance = axios.create( {} );

// This is the main setup to call backend api from frontend

export const apiConnector = ( method, url , bodyDate, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyDate ? bodyDate : null,
        headers:headers ? headers : null,
        params: params ? params : null,
    });
}