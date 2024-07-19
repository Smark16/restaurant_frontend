import React, { useContext, useEffect } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import { AuthContext } from '../Context/AuthContext';
function Logout() {
    const { setUser, setAuthTokens } = useContext(AuthContext);

    useEffect(() => {
        // Function to handle logout and show alert
        const logoutUser = () => {
            setAuthTokens(null);
            setUser(null);
            localStorage.removeItem("authtokens");
            Swal.fire({
                icon: 'success',
                title: 'Logged Out Successfully',
                text: 'You have been logged out.',
                confirmButtonText: 'OK'
            })
                window.location.href = '/'; // Redirect to login page
            
        };

        // Call the logout function
        logoutUser();
    }, [setUser, setAuthTokens]);

    return null; // Since this is a logout action, no need to render anything
}

export default Logout;

