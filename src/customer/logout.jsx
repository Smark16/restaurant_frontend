import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert

function Logout() {
    const { setUser, setAuthTokens } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        // Function to handle logout and show alert
        const logoutUser = () => {
            setAuthTokens(null);
            setUser(null);
            localStorage.removeItem("authtokens");
            localStorage.removeItem('lastPath');
            Swal.fire({
                icon: 'success',
                title: 'Logged Out Successfully',
                text: 'You have been logged out.',
                confirmButtonText: 'OK'
            })
                navigate('/login') // Redirect to login page
            
        };

        // Call the logout function
        logoutUser();
    }, [setUser, setAuthTokens]);

    return null; // Since this is a logout action, no need to render anything
}

export default Logout;
