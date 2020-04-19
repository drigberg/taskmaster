
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Task from './Task';
import EditModeButtons from './EditModeButtons';

export default function Dashboard(props) {
    const {
        userName,
        fetching,
        errorMessage,
        tasks,
        setTasks,
    } = props;

    const [editMode, setEditMode] = useState(false);
    const [taskUpdates, setTaskUpdates] = useState({});

    let body = null;

    function handleChange(taskId, updateData) {
        setTaskUpdates({
            ...taskUpdates,
            [taskId]: {
                ...tasks[taskId],
                ...updateData
            }
        });
    }

    function handleSave() {
        setTasks({
            ...tasks,
            ...taskUpdates
        });
    }

    function handleDiscardChanges() {
        setTaskUpdates({});
    }

    if (fetching) {
        body = <div><p>Fetching data...</p></div>;
    } else if (errorMessage) {
        body = <div><p>Error: {errorMessage}</p></div>;
    } else {
        body = <div>
            <EditModeButtons
                editMode={editMode}
                setEditMode={setEditMode}
                handleSave={handleSave}
                handleDiscardChanges={handleDiscardChanges}
            />
            <ul>
                {Object.values(tasks).map(({id, name, frequency, completionDates}) => (
                    <Task 
                        key={id}
                        id={id}
                        name={name}
                        frequency={frequency}
                        completionDates={completionDates}
                        editMode={editMode}
                        handleChange={handleChange}
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
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool.isRequired,
    tasks: PropTypes.object.isRequired,
    setTasks: PropTypes.func.isRequired
};