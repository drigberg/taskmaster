import React, { useState, useEffect } from 'react';
import { BrowserRouter as Switch, Route, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import Home from './Home';
import Dashboard from './Dashboard';
import apiClient from '../lib/apiClient';
import {
    redirectToHostedSigninPage,
} from '../lib/auth';
import ProtectedRoute from './ProtectedRoute';


export default function AppRouter() {
    function useQuery() {
        return queryString.parse(useLocation().search);
    }
      
    const { code: authorizationCode } = useQuery();
    // assume loggedIn until proven wrong -- this can never expose data,
    // since API calls will fail, at least until we implement caching
    const [loggedIn, setLoggedIn] = useState(true);
    const [idToken, setIdToken] = useState('');
    const [userId, setUserId] = useState('');
    const [fetching, setFetching] = useState(false);
    const [userName, setUserName] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    function onLogout() {
        setUserName(null);
        setUserId('');
        setIdToken('');
        setLoggedIn(false);
    }

    async function getToken() {
        let idToken;
        setFetching(true);
        setErrorMessage(null);
        try {
            idToken = await apiClient.getIdToken(authorizationCode);
            setIdToken(idToken);
            setLoggedIn(true);
        } catch {
            onLogout();
            setFetching(false);
        }
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
                loggedIn={loggedIn}
                onLogout={onLogout}
                userName={userName}
                fetching={fetching}
                errorMessage={errorMessage}
            />)}>
            </Route>
            <ProtectedRoute
                exact path="/dashboard"
                component={Dashboard}
                loggedIn={loggedIn}
                userId={userId}
                userName={userName}
                fetching={fetching}
                errorMessage={errorMessage}
                setFetching={setFetching}
                setErrorMessage={setErrorMessage}
            />
        </Switch>
    </div>);
}