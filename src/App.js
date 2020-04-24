import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import apiClient from './lib/apiClient';

export default function App() {
    const [userId, setUserId] = useState('lukeskywalker');
    const [fetching, setFetching] = useState(false);
    const [userName, setUserName] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        setFetching(true);
        setErrorMessage(null);

        apiClient
            .fetchUserData(userId)
            .then((data) => {
                setFetching(false);
                setUserName(data.name);
            })
            .catch(() => {
                setFetching(false);
                setErrorMessage('Error fetching user data');
            });
    }, []);

    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/dashboard">
                        <Dashboard
                            userId={userId}
                            userName={userName}
                            fetching={fetching}
                            errorMessage={errorMessage}
                            setFetching={setFetching}
                            setErrorMessage={setErrorMessage}
                        />
                    </Route>
                    <Route path="/">
                        <Home
                            userName={userName}
                            fetching={fetching}
                            errorMessage={errorMessage}
                        />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
