import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Task from './Task';
import NewTask from './NewTask';
import EditModeButtons from './EditModeButtons';
import apiClient from '../lib/apiClient';

export default function Dashboard(props) {
    const { userId, userName, fetching, errorMessage, setFetching, setErrorMessage } = props;
    const [tasksById, setTasksById] = useState([]);
    const [creating, setCreating] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // tasksMutations is the simplified set of mutations to be provided
    // in the POST call to updateTasksBulk
    const [tasksMutations, setTasksMutations] = useState({});

    useEffect(() => {
        fetchTasks();
    }, []);

    /**
     * Fetches tasks
     */
    function fetchTasks() {
        setFetching(true);
        setErrorMessage(null);
        return apiClient
            .fetchTasks()
            .then((items) => {
                setFetching(false);
                const itemsById = items.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                }, {});
                setTasksById(itemsById);
            })
            .catch((error) => {
                setFetching(false);
                setErrorMessage(`Error: ${error}`);
            }); 
    }

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

                if (value !== tasksById[taskId][key]) {
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
                ...mutation,
            },
        };
        // resolve updates that were restored to original value
        const simplifiedUpdateData = getSimplifiedUpdateData(updatedDataByTaskId);
        setTasksMutations(simplifiedUpdateData);

        // apply updates to tasks
        const updatedTasksById = {};
        Object.keys(tasksById).forEach((taskId) => {
            const updatesForTask = simplifiedUpdateData[taskId] || {};
            updatedTasksById[taskId] = {
                ...tasksById[taskId],
                ...updatesForTask,
            };
        });
        setTasksById(updatedTasksById);
    }

    /**
     * Apply updates to tasks
     */
    function handleSave() {
        setFetching(true);
        apiClient
            .updateTasksBulk(tasksById)
            .then(() => fetchTasks());
    }

    function handleDiscardChanges() {
        setTasksMutations({});
        setFetching(true);
        fetchTasks();
    }

    function handleCreate(newTaskData) {
        apiClient
            .createTask(newTaskData)
            .then(() => fetchTasks());
    }

    function handleTaskCompletion(taskId) {
        const dateString = new Date().toISOString().split('T')[0];
        if (tasksById[taskId].completionDates.includes(dateString)) {
            return;
        }
        apiClient
            .addTaskCompletionDate(taskId, dateString)
            .then(() => fetchTasks());
    }

    function createTaskComponentFromData(data) {
        return (
            <Task
                key={data.id}
                id={data.id}
                archived={data.archived}
                name={data.name}
                frequency={data.frequency}
                completionDates={data.completionDates}
                editMode={editMode}
                handleChange={handleChange}
                handleTaskCompletion={handleTaskCompletion}
            />
        );
    }

    let body = null;

    // TODO: use banner here instead of body replace
    if (fetching) {
        body = (
            <div>
                <p>Fetching data...</p>
            </div>
        );
    } else if (errorMessage) {
        body = (
            <div>
                <p>Error: {errorMessage}</p>
            </div>
        );
    } else {
        const unarchivedTasks = Object.values(tasksById).filter(
            (task) => !task.archived
        );
        const archivedTasks = Object.values(tasksById).filter((task) => task.archived);
        const bodyComponents = [];
        const buttons = [];

        // add edit mode buttons
        if (!creating) {
            buttons.push(
                <EditModeButtons
                    key="editModeButtons"
                    editMode={editMode}
                    setEditMode={setEditMode}
                    handleSave={handleSave}
                    handleDiscardChanges={handleDiscardChanges}
                />
            );
        }

        // add newTask component
        if (!editMode) {
            buttons.push(
                <NewTask
                    key="newTask"
                    creating={creating}
                    setCreating={setCreating}
                    handleCreate={handleCreate}
                />
            );
        }

        bodyComponents.push(
            <div className="button-wrapper">
                <div className="button-container">{buttons}</div>
            </div>
        );

        // add tasks list
        const tasksListComponents = [
            unarchivedTasks.map(createTaskComponentFromData),
        ];
        if (editMode && archivedTasks.length) {
            tasksListComponents.push(
                <h3 key="archivedTasks">Archived Tasks</h3>,
                archivedTasks.map(createTaskComponentFromData)
            );
        }
        bodyComponents.push(
            <ul className="cards" key="tasksListComponents">
                {tasksListComponents}
            </ul>
        );

        // create body
        body = <div>{bodyComponents}</div>;
    }

    return (
        <div>
            <h1>{userName}’s Tasks</h1>
            {body}
        </div>
    );
}

Dashboard.propTypes = {
    userId: PropTypes.string,
    userName: PropTypes.string,
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool.isRequired,
    setFetching: PropTypes.func.isRequired,
    setErrorMessage: PropTypes.func.isRequired,
};
