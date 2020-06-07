import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory } from 'history';

import Task from './Task';
import NewTask from './NewTask';
import EditModeButtons from './EditModeButtons';
import apiClient from '../lib/apiClient';

export default function Dashboard(props) {
    const { userName, fetching, errorMessage, setFetching, setErrorMessage } = props;
    const [tasksById, setTasksById] = useState([]);
    const [creating, setCreating] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const history = createBrowserHistory();

    // tasksMutations is the simplified set of mutations to be provided
    // in the POST call to updateTasksBulk
    const [tasksMutations, setTasksMutations] = useState({});

    useEffect(() => {
        if (userName) {
            fetchTasks();
        }
    }, [userName]);

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

                // calculate days since completed to be used for sorting and styling
                items.forEach(item => {
                    if (item.completionDates.length) {
                        const lastCompleted = item.completionDates[item.completionDates.length - 1];
                        const today = new Date(new Date().setHours(0, 0, 0, 0));
                        const msSinceCompleted = today - new Date(lastCompleted);
                        const daysSinceCompleted = Math.round(msSinceCompleted / (24 * 60 * 60 * 1000));
                        item.daysSinceCompleted = daysSinceCompleted;
                        item.daysOverdue = daysSinceCompleted - item.frequency;
                        item.daysUntilDue = item.frequency - daysSinceCompleted;
                        if (item.daysUntilDue < 0) {
                            item.daysUntilDue = 0;
                        }
                    } else {
                        item.daysSinceCompleted = null;
                        item.daysOverdue = null;
                        item.daysUntilDue = 0;
                    }
                });

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

    function createButtons() {
        const buttons = [
            <button
                key='home'
                onClick={() => history.push('/')}
            ><span role="img" aria-label="house">🏠</span>Home</button>
        ];

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

        return buttons;
    }

    function createTaskComponentFromData(data, severity = null) {
        return (
            <Task
                key={data.id}
                id={data.id}
                archived={data.archived}
                name={data.name}
                frequency={data.frequency}
                completionDates={data.completionDates}
                daysSinceCompleted={data.daysSinceCompleted}
                daysOverdue={data.daysOverdue}
                editMode={editMode}
                severity={severity}
                handleChange={handleChange}
                handleTaskCompletion={handleTaskCompletion}
            />
        );
    }

    function groupTasksByDueDate(tasks) {
        const tasksByDueDate = [];
        const categoriesWithComparisonFunctions = [
            ['Due Today', task => task.daysUntilDue === 0, 'danger'],
            ['Due Tomorrow', task => task.daysUntilDue === 1, 'warning'],
            ['Due Later This Week', task => task.daysUntilDue > 1 && task.daysUntilDue <= 7, 'success'],
            ['Due Eventually', task => task.daysUntilDue > 7, 'success']
        ];
        categoriesWithComparisonFunctions.forEach(([category, comparisonFunction, severity]) => {
            const matchingTasks = tasks.filter(comparisonFunction);
            if (matchingTasks.length) {
                tasksByDueDate.push([category, matchingTasks.map(task => createTaskComponentFromData(task, severity))]);
            }
        });
        return tasksByDueDate;
    }

    let body = null;

    // TODO: use banner here instead of body replace
    if (fetching) {
        body = (
            <div>
                <p>Loading...</p>
            </div>
        );
    } else if (errorMessage) {
        body = (
            <div>
                <p>Error: {errorMessage}</p>
            </div>
        );
    } else if (!userName) {
        body = (
            <div>
                <p>No data yet</p>
            </div>
        );
    } else {
        const bodyComponents = [
            (<h1 key='username'>{userName}’s Tasks</h1>),
            (<div key='button-wrapper' className="button-wrapper">
                <div className="button-container">{createButtons()}</div>
            </div>)
        ];

        // group tasks
        const unarchivedTasks = Object.values(tasksById)
            .filter((task) => !task.archived)
            .sort((item1, item2) => {
                // sort most-overdue tasks at the top
                if (item1.daysOverdue !== null && item2.daysOverdue === null) {
                    return 1;
                } else if (item1.daysOverdue === null && item2.daysOverdue !== null) {
                    return -1;
                } else if (item1.daysOverdue / item1.frequency < item2.daysOverdue / item2.frequency) {
                    return 1;
                } else if (item1.daysOverdue / item1.frequency > item2.daysOverdue / item2.frequency) {
                    return -1;
                }
                return 0;
            });
        
        const archivedTasks = Object.values(tasksById).filter((task) => task.archived);

        // add tasks list
        if (editMode) {
            const tasksListComponents = [
                unarchivedTasks.map(task => createTaskComponentFromData(task, 'EDIT')),
            ];
            if (archivedTasks.length) {
                tasksListComponents.push(
                    <h3 key="archivedTasks">Archived Tasks</h3>,
                    archivedTasks.map(task => createTaskComponentFromData(task, 'EDIT'))
                );
            }
            bodyComponents.push(
                <ul className="cards" key="tasksListComponents">
                    {tasksListComponents}
                </ul>
            );
        } else {
            const tasksByDueDate = groupTasksByDueDate(unarchivedTasks);
            const tasksListComponents = tasksByDueDate.map(([sectionTitle, tasks]) => (
                <div key={sectionTitle}>
                    <h2>{sectionTitle}</h2>
                    <ul className="cards">
                        {tasks}
                    </ul>
                </div>
            ));
            bodyComponents.push(tasksListComponents);
        }

        // create body
        body = <div key='body-div'>{bodyComponents}</div>;
    }

    return (
        <div>
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
