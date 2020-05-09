import React, { useState, useEffect } from 'react';
import { BrowserRouter as Switch, Route, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import Home from './Home';
import Dashboard from './Dashboard';
import apiClient from '../lib/apiClient';
import {
    redirectToHostedSigninPage,
} from '../lib/auth';


export default function AppRouter() {
    function useQuery() {
        return queryString.parse(useLocation().search);
    }
      
    const { code: authorizationCode } = useQuery();
    // const [loggedIn, setLoggedIn] = useState(false);
    const [idToken, setIdToken] = useState('');
    const [userId, setUserId] = useState('');
    const [fetching, setFetching] = useState(false);
    const [userName, setUserName] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    function onLogout() {
        setUserName(null);
        setUserId('');
        setIdToken('');
    }

    async function getToken() {
        let idToken;
        setFetching(true);
        setErrorMessage(null);
        try {
            idToken = await apiClient.getIdToken(authorizationCode);
        } catch (err) {
            console.error(`Error validating authorization code: ${err}`);
            setFetching(false);
            setErrorMessage('Unable to log in');
            return;
        }
        setIdToken(idToken);
    }

    async function getUserData() {
        setFetching(true);
        setErrorMessage(null);
        let userData;
        try {
            userData = await apiClient.fetchUserData();
        } catch (err) {
            setFetching(false);
            setErrorMessage('Error fetching user data');
            return;
        }

        setUserId(userData.id);
        setUserName(userData.name);
        setFetching(false);
        setErrorMessage(null);
    }

    useEffect(() => {
        if (!idToken) {
            getToken();
            return;
        }
        apiClient.updateIdToken(idToken);
        getUserData();
    }, [idToken]);

    return (<div>
        <Switch>
            <Route exact path='/login' component={() => { 
                redirectToHostedSigninPage();
                return null;
            }}/>
            <Route exact path="/" render={(props) => (<Home
                {...props}
                onLogout={onLogout}
                userName={userName}
                fetching={fetching}
                errorMessage={errorMessage}
            />)}>
            </Route>
            <Route exact path="/dashboard" render={(props) => (<Dashboard
                {...props}
                userId={userId}
                userName={userName}
                fetching={fetching}
                errorMessage={errorMessage}
                setFetching={setFetching}
                setErrorMessage={setErrorMessage}
            />)}>
            </Route>
        </Switch>
    </div>);
}