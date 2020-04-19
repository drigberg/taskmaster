
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import Task from './Task';

function getEditModeButtons(editMode, setEditMode, handleSave, handleDiscardChanges) {
    function onSave() {
        handleSave();
        setEditMode(false);
    }

    function onDiscardChanges() {
        handleDiscardChanges();
        setEditMode(false);
    }

    if (editMode) {
        return <div>
            <Button
                variant="contained"
                color="primary"
                onClick={onSave}
            >Save Changes</Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={onDiscardChanges}
            >Discard Changes</Button>
        </div>;
    }
    return <div>
        <Button
            variant="contained"
            color="primary"
            onClick={() => setEditMode(true)}
        >Edit Tasks</Button>
    </div>;
}

export default function Dashboard(props) {
    const {
        userName,
        fetching,
        errorMessage,
        tasks,
        setTasks,
    } = props;

    const [editMode, setEditMode] = useState(false);
    const [updateTasks, setUpdateTasks] = useState({});

    let body = null;

    function handleChange(taskId, updateData) {
        setUpdateTasks({
            ...updateTasks,
            [taskId]: {
                ...tasks[taskId],
                ...updateData
            }
        });
    }

    function handleSave() {
        setTasks({
            ...tasks,
            ...updateTasks
        });
    }

    function handleDiscardChanges() {
        setUpdateTasks({});
    }

    if (fetching) {
        body = <div><p>Fetching data...</p></div>;
    } else if (errorMessage) {
        body = <div><p>Error: {errorMessage}</p></div>;
    } else {
        body = <div>
            {getEditModeButtons(editMode, setEditMode, handleSave, handleDiscardChanges)}
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