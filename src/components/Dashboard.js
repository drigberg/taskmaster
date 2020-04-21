
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Task from './Task';
import NewTask from './NewTask';
import EditModeButtons from './EditModeButtons';
import apiClient from '../lib/apiClient';

export default function Dashboard(props) {
    const {
        userId,
        userName,
        fetching,
        errorMessage,
        tasks,
        setTasks,
    } = props;

    const [creating, setCreating] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // tasksMutations is the simplified set of mutations to be provided
    // in the POST call to updateTasks
    const [tasksMutations, setTasksMutations] = useState({});

    let body = null;

    /**
     * Prunes updated task data by removing key-value pairs that are equivalent
     * to original data
     * @param {Object} updateData - updates by task id
     */
    function getSimplifiedUpdateData(updateData) {
        const simplified = {};
        Object.entries(updateData).forEach(([taskId, taskUpdateObj]) => {
            const taskDiff = {};
            Object.entries(taskUpdateObj).forEach(([key, value]) => {
                if (['id', 'completionDates'].includes(key)) {
                    return;
                }
                
                if (value !== tasks[taskId][key]) {
                    taskDiff[key] = value;
                }
            });
            if (Object.keys(taskDiff).length > 0) {
                simplified[taskId] = taskDiff;
            }
        });
        return simplified;
    }

    /**
     * Adds new data to update object and reduces to actual diffs
     * @param {String} taskId 
     * @param {Object} mutation 
     */
    function handleChange(taskId, mutation) {
        // apply mutation to tasksMutations
        const updatedDataByTaskId = {
            ...tasksMutations,
            [taskId]: {
                ...tasksMutations[taskId],
                ...mutation
            }
        };
        // resolve updates that were restored to original value
        const simplifiedUpdateData = getSimplifiedUpdateData(updatedDataByTaskId);
        setTasksMutations(simplifiedUpdateData);
        
        // apply updates to tasks
        const updatedTasks = {};
        Object.keys(tasks).forEach((taskId) => {
            const updatesForTask = simplifiedUpdateData[taskId] || {};
            updatedTasks[taskId] = {
                ...tasks[taskId],
                ...updatesForTask
            };
        });
        setTasks(updatedTasks);
    }

    /**
     * Apply updates to tasks
     */
    function handleSave() {
        apiClient.updateTasks(userId, tasks)
        .then((tasks) => {
            setTasks(tasks);
        })
        .catch((error) => {
            console.log(error);
            // TODO: handle error
        });
    }

    function handleDiscardChanges() {
        setTasksMutations({});
    }

    function handleCreate(newTaskData) {
        apiClient.createTask(userId, newTaskData)
        .then((tasks) => {
            setTasks(tasks);
        })
        .catch((error) => {
            console.log(error);
            // TODO: handle error
        });
    }

    // TODO: use banner here instead of body replace
    if (fetching) {
        body = <div><p>Fetching data...</p></div>;
    } else if (errorMessage) {
        body = <div><p>Error: {errorMessage}</p></div>;
    } else {
        body = <div>
            {creating ? null : <EditModeButtons
                editMode={editMode}
                setEditMode={setEditMode}
                handleSave={handleSave}
                handleDiscardChanges={handleDiscardChanges}
            />}
            {editMode ? null : <NewTask creating={creating} setCreating={setCreating} handleCreate={handleCreate}/>}
            <ul>
                {Object.values(tasks)
                    .filter(task => !task.archived || editMode)
                    .map(({id, name, frequency, archived, completionDates}) => (
                        <Task 
                            key={id}
                            id={id}
                            archived={archived}
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
    userId: PropTypes.string,
    userName: PropTypes.string,
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool.isRequired,
    tasks: PropTypes.object.isRequired,
    setTasks: PropTypes.func.isRequired
};