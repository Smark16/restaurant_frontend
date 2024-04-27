import {useContext} from 'react'
import {AuthContext} from '../context/MyContext'
import axios from 'axios'
import dayjs from 'dayjs'
import * as jwt_decode from 'jwt-decode';

const baseURL = 'http://127.0.0.1:8000/restaurant'

//we want to create refresh tokens
const useAxios =()=>{
const {setUser, authTokens, setAuthTokens} = useContext(AuthContext)
//code to inform a server that you have access or not by adding authkokens
const  axiosInstance = axios.create({
    baseURL,
    headers:{"Authorization": `Bearer ${authTokens?.access}`},
})

// Intercepting requests to check and refresh authentication tokens
axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    try {
        // Sending a request to refresh the access token
        const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: authTokens.refresh,
        });

        // Updating local storage with new tokens and user
        localStorage.setItem("authtokens", JSON.stringify(response.data));
        setAuthTokens(response.data);
        setUser(jwt_decode(response.data.access));

        // Updating the request header with the new access token
        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
    } catch (error) {
        // Handling errors during token refresh
        console.log("Error refreshing token:", error);
        return Promise.reject(error);
    }
});

// Returning the Axios instance with interceptors
return axiosInstance;
}

export default useAxios
