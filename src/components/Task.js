import React from "react";
import PropTypes from "prop-types";

export default function Task(props) {
  const {
    id,
    name,
    frequency,
    completionDates,
    editMode,
    handleChange,
  } = props;

  let className = "success";
  let lastCompletedString = "never";
  if (completionDates.length) {
    // assume sorted
    const lastCompleted = completionDates[completionDates.length - 1];
    const msSinceCompleted = new Date() - new Date(lastCompleted);
    const daysSinceCompleted = msSinceCompleted / (24 * 60 * 60 * 1000);
    const roundedDays = Math.round(daysSinceCompleted);
    lastCompletedString = `${roundedDays} days ago`;

    // determine health of task based on last completion
    if (roundedDays > frequency && roundedDays < frequency * 2) {
      className = "warning";
    } else {
      className = "danger";
    }
  }

  function onNameChange(event) {
    handleChange(id, { name: event.target.value });
  }

  function onFrequencyChange(event) {
    handleChange(id, { frequency: parseInt(event.target.value, 10) });
  }

  function setArchived() {
    handleChange(id, { archived: true });
  }

  if (editMode) {
    return (
      <div key={name} className="edit-task">
        <div className="form-group">
          <label htmlFor={name}>Your task</label>
          <input
            id={name}
            label="Name"
            variant="outlined"
            defaultValue={name}
            onChange={onNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor={String(frequency)}>Task frequency</label>

          <input
            id={String(frequency)}
            label="Frequency In Days"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            defaultValue={frequency}
            onChange={onFrequencyChange}
          />
        </div>
        <button variant="contained" color="secondary" onClick={setArchived}>
          📼 Archive
        </button>
      </div>
    );
  }

  return (
    <div key={name} className={`card ${className}`}>
      <h4>
        {name} every {frequency} days
      </h4>
      <p>
        Last completed: <span>{lastCompletedString}</span>
      </p>
      <button variant="contained" color="primary">
        ✓
      </button>
    </div>
  );
}

Task.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  editMode: PropTypes.bool,
  frequency: PropTypes.number,
  completionDates: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};
