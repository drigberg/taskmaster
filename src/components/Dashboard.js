
import React from 'react';
import PropTypes from 'prop-types';

function createElementsForTasks(items) {
    return items.map(item => {
        let lastCompletedString = 'never';
        if (item.completionDates.length) {
            const lastCompleted = item.completionDates[item.completionDates.length - 1];
            const msSinceCompleted = (new Date() - new Date(lastCompleted));
            const daysSinceCompleted = msSinceCompleted / (24 * 60 * 60 * 1000);
            const roundedDays = Math.round(daysSinceCompleted);
            lastCompletedString = `${roundedDays} days ago`;
        }

        return (<div key={item.name}>
            <h4>{item.name} every {item.frequency} days</h4>
            <p>Last completed: {lastCompletedString}</p> 
        </div>);
    });
}

export default function Dashboard(props) {
    const {
        userName,
        fetching,
        errorMessage,
        tasks,
    } = props;
    let body = null;

    if (fetching) {
        body = <div><p>Fetching data...</p></div>;
    } else if (errorMessage) {
        body = <div><p>Error: {errorMessage}</p></div>;
    } else {
        body = <div>{createElementsForTasks(tasks)}</div>;
    }

    return (
        <div>
            <h2>{userName}’s Tasks</h2>
            {body}
        </div>
    );
}

Dashboard.propTypes = {
    userName: PropTypes.string,
    fetching: PropTypes.bool,
    errorMessage: PropTypes.string,
    tasks: PropTypes.array.isRequired
};