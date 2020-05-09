
import React from 'react';
import PropTypes from 'prop-types';

import apiClient from '../lib/apiClient';

export default function Home(props) {
    let text;
    if (props.fetching) {
        text = 'Fetching data...';
    } else if (props.errorMessage) {
        text = `Error: ${props.errorMessage}`;
    } else if (!props.userName) {
        text = 'Please log in!';
    } else {
        text = `Welcome, ${props.userName}`;
    }
    
    function logout() {
        console.log('Trying to log out...');
        apiClient.logout()
            .catch(() => null)
            .then(() => {
                props.onLogout();
            });
    }
    return (<div>
        <h1>Task Master</h1>
        <h2>{text}</h2>
        <a href="/login/"><button>Sign In / Register</button></a>
        <button onClick={logout}>Logout</button>
        <a href="/dashboard/"><button>Dashboard</button></a>
    </div>);
}

Home.propTypes = {
    userName: PropTypes.string,
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,
};
