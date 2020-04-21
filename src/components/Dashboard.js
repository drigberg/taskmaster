
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
        apiClient.fetchUserData(userId)
            .then((data) => {
                setTasks(data.tasks);
            })
            .catch(() => {
                // TODO: handle error
            });
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

    function createTaskComponentFromData(data) {
        return <Task 
            key={data.id}
            id={data.id}
            archived={data.archived}
            name={data.name}
            frequency={data.frequency}
            completionDates={data.completionDates}
            editMode={editMode}
            handleChange={handleChange}
        />;
    }

    // TODO: use banner here instead of body replace
    if (fetching) {
        body = <div><p>Fetching data...</p></div>;
    } else if (errorMessage) {
        body = <div><p>Error: {errorMessage}</p></div>;
    } else {
        const unarchivedTasks = Object.values(tasks).filter(task => !task.archived);
        const archivedTasks = Object.values(tasks).filter(task => task.archived);

        body = <div>
            {creating ? null : <EditModeButtons
                editMode={editMode}
                setEditMode={setEditMode}
                handleSave={handleSave}
                handleDiscardChanges={handleDiscardChanges}
            />}
            {editMode ? null : <NewTask creating={creating} setCreating={setCreating} handleCreate={handleCreate}/>}
            <ul>
                {unarchivedTasks.map(createTaskComponentFromData)}
                {editMode && archivedTasks.length ? <h3>Archived Tasks</h3> : null}
                {editMode ? archivedTasks.map(createTaskComponentFromData) : null}
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