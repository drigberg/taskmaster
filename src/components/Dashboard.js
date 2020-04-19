
import React from 'react';
import apiClient from '../lib/apiClient';

class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            userName: null,
            tasks: [],
            fetching: false,
            error: null,
        };
    }

    componentDidMount() {
        const that = this;
        Promise.resolve()
            .then(async () => {
                that.setState({ fetching: true });
                const userData = await apiClient._fetchUserData('lukeskywalker');
                console.log(userData);
                that.setState({
                    userName: userData.name,
                    tasks: userData.tasks.map(task => ({
                        name: task.name,
                        frequency: task.frequency,
                        completionDates: task.completionDates
                    })),
                    fetching: false
                });
            })
            .catch(() => {
                that.setState({
                    fetching: false,
                    error: 'Error fetching user data' });
            });
    }

    getTasksList() {
        let tasks = [];
        if (this.state.tasks) {
            tasks = this.state.tasks.map(task => {
                let lastCompletedString = 'never';
                if (task.completionDates.length) {
                    const lastCompleted = task.completionDates[task.completionDates.length - 1];
                    const msSinceCompleted = (new Date() - new Date(lastCompleted));
                    const daysSinceCompleted = msSinceCompleted / (24 * 60 * 60 * 1000);
                    const roundedDays = Math.round(daysSinceCompleted);
                    lastCompletedString = `${roundedDays} days ago`;
                }

                return (<div key={task.name}>
                    <h4>{task.name} every {task.frequency} days</h4>
                    <p>Last completed: {lastCompletedString}</p> 
                </div>);
            });
        }
        return tasks;
    }

    render() {
        let body = null;

        if (this.state.fetching) {
            body = <div><p>Fetching data...</p></div>;
        } else if (this.state.error) {
            body = <div><p>Error: {this.state.error}</p></div>;
        } else {
            body = <div>{this.getTasksList()}</div>;
        }

        return (
            <div>
                <h2>{this.state.userName}’s Tasks</h2>
                {body}
            </div>
        );
    }
}

export default Dashboard;