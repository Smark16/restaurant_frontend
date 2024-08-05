import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';

const baseURL = 'http://127.0.0.1:8000/restaurant/';

const useAxios = () => {
  const { setUser, authTokens, setAuthTokens } = useContext(AuthContext);

  // Create an Axios instance with the base URL and authorization header
  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });

  // Intercepting requests to check and refresh authentication tokens
  axiosInstance.interceptors.request.use(async (req) => {
    // Decode the access token to check its expiration
    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    // If the access token is not expired, proceed with the request
    if (!isExpired) return req;

    try {
      // Sending a request to refresh the access token using the refresh token
      const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh: authTokens.refresh,
      });

      // Update local storage with the new tokens
      localStorage.setItem("authtokens", JSON.stringify(response.data));
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));

      // Update the request header with the new access token
      req.headers.Authorization = `Bearer ${response.data.access}`;
      return req;
    } catch (error) {
      console.log("Error refreshing token:", error);
      // Optionally, redirect the user to login if the refresh token fails
      // window.location.href = '/login';
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem('authtokens');
      Swal.fire({
        icon: 'success',
        title: 'Your session has expired',
        text: 'You have been logged out.',
        confirmButtonText: 'OK'
    })
      window.location.href = '/login';
      return Promise.reject(error);
    }
  });

  // Returning the Axios instance with interceptors
  return axiosInstance;
};

export default useAxios;
