import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import './App.css';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import apiClient from './lib/apiClient';

export default function App() {
  const [fetching, setFetching] = useState(null);
  const [userName, setUserName] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
      setFetching(true);
      setErrorMessage(null);

      apiClient._fetchUserData('lukeskywalker')
        .then((data) => {

        const tasks = data.tasks.map(task => ({
          name: task.name,
          frequency: task.frequency,
          completionDates: task.completionDates
        }));
    
        setTasks(tasks);
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
              userName={userName}
              fetching={fetching}
              errorMessage={errorMessage}
              tasks={tasks}
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
