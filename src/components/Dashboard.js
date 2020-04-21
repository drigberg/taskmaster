import React, { useState } from "react";
import PropTypes from "prop-types";

import Task from "./Task";
import NewTask from "./NewTask";
import EditModeButtons from "./EditModeButtons";
import apiClient from "../lib/apiClient";

export default function Dashboard(props) {
  const { userId, userName, fetching, errorMessage, tasks, setTasks } = props;

  const [creating, setCreating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [taskUpdates, setTaskUpdates] = useState({});

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
        if (["id", "completionDates"].includes(key)) {
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
    // apply mutation to taskUpdates
    const updatedDataByTaskId = {
      ...taskUpdates,
      [taskId]: {
        ...taskUpdates[taskId],
        ...mutation,
      },
    };
    // resolve updates that were restored to original value
    const simplifiedUpdateData = getSimplifiedUpdateData(updatedDataByTaskId);
    setTaskUpdates(simplifiedUpdateData);
  }

  /**
   * Apply updates to tasks
   */
  function handleSave() {
    const updatedTasks = {};
    Object.keys(tasks).forEach((taskId) => {
      const updatesForTask = taskUpdates[taskId] || {};
      updatedTasks[taskId] = {
        ...tasks[taskId],
        ...updatesForTask,
      };
    });
    apiClient
      .updateTasks(userId, updatedTasks)
      .then((tasks) => {
        setTasks(tasks);
      })
      .catch((error) => {
        console.log(error);
        // TODO: handle error
      });
  }

  function handleDiscardChanges() {
    setTaskUpdates({});
  }

  function handleCreate(newTaskData) {
    apiClient
      .createTask(userId, newTaskData)
      .then((tasks) => {
        setTasks(tasks);
      })
      .catch((error) => {
        console.log(error);
        // TODO: handle error
      });
  }

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
    body = (
      <div>
        <div className="buttons-wrapper">
          <div className="buttons-container">
            {creating ? null : (
              <EditModeButtons
                editMode={editMode}
                setEditMode={setEditMode}
                handleSave={handleSave}
                handleDiscardChanges={handleDiscardChanges}
              />
            )}
            {editMode ? null : (
              <NewTask
                creating={creating}
                setCreating={setCreating}
                handleCreate={handleCreate}
              />
            )}
          </div>
        </div>
        <ul className="cards">
          {Object.values(tasks).map(
            ({ id, name, frequency, completionDates }) => (
              <Task
                key={id}
                id={id}
                name={name}
                frequency={frequency}
                completionDates={completionDates}
                editMode={editMode}
                handleChange={handleChange}
              />
            )
          )}
        </ul>
      </div>
    );
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
  tasks: PropTypes.object.isRequired,
  setTasks: PropTypes.func.isRequired,
};
