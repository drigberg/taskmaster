
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import Task from './Task';

export default function Dashboard(props) {
    const {
        userName,
        fetching,
        errorMessage,
        tasks,
    } = props;

    const [editMode, setEditMode] = useState(false);

    const handleEditModeToggle = (event) => {
        setEditMode(event.target.checked);
    };

    let body = null;

    if (fetching) {
        body = <div><p>Fetching data...</p></div>;
    } else if (errorMessage) {
        body = <div><p>Error: {errorMessage}</p></div>;
    } else {
        body = <div>
            <div>
                <label>Edit Mode</label>
                <Checkbox
                    checked={editMode}
                    onChange={handleEditModeToggle}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            </div>
            <ul>
                {tasks.map(({name, frequency, completionDates}) => (
                    <Task 
                        key={name}
                        name={name}
                        frequency={frequency}
                        completionDates={completionDates}
                        editMode={editMode}
                    />))}
            </ul>
        </div>;
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