import React from 'react';
import PropTypes from 'prop-types';

export default function Task(props) {
    const {
        id,
        name,
        frequency,
        completionDates,
        archived,
        editMode,
        handleChange,
        handleTaskCompletion,
    } = props;

    let className = 'success';
    let lastCompletedString = 'never';
    if (completionDates.length) {
    // assume sorted
        const lastCompleted = completionDates[completionDates.length - 1];
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const msSinceCompleted = today - new Date(lastCompleted);
        const daysSinceCompleted = msSinceCompleted / (24 * 60 * 60 * 1000);
        const roundedDays = Math.round(daysSinceCompleted);
        lastCompletedString = `${roundedDays} days ago`;
        if (roundedDays === 0) {
            lastCompletedString = 'today';
        }

        // determine health of task based on last completion
        if (roundedDays >= frequency && roundedDays < frequency * 2) {
            className = 'warning';
        } else if (roundedDays >= frequency * 2) {
            className = 'danger';
        }
    }

    function onNameChange(event) {
        handleChange(id, { name: event.target.value });
    }

    function onFrequencyChange(event) {
        handleChange(id, { frequency: parseInt(event.target.value, 10) });
    }

    function setArchived(val) {
        handleChange(id, { archived: val });
    }

    if (editMode) {
        let archiveToggleButton;
        if (archived) {
            // onMouseDown used because onClick doesn't fire if onBlur is firing
            // from an input at the same time.
            // (see https://stackoverflow.com/questions/44142273/react-ul-with-onblur-event-is-preventing-onclick-from-firing-on-li)
            archiveToggleButton = (
                <button
                    variant="contained"
                    color="secondary"
                    onMouseDown={() => setArchived(false)}
                >
          📼 Unarchive
                </button>
            );
        } else {
            archiveToggleButton = (
                <button
                    variant="contained"
                    color="secondary"
                    onMouseDown={() => setArchived(true)}
                >
          📼 Archive
                </button>
            );
        }
        return (
            <div key={name} className="edit-task">
                <div className="form-group">
                    <label htmlFor={name}>Your task</label>
                    <input
                        id={name}
                        label="Name"
                        variant="outlined"
                        defaultValue={name}
                        onBlur={onNameChange}
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
                        onBlur={onFrequencyChange}
                    />
                </div>
                {archiveToggleButton}
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
            <button
                variant="contained"
                color="primary"
                onMouseDown={() => handleTaskCompletion(id)}
            >
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
    archived: PropTypes.bool.isRequired,
    completionDates: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleTaskCompletion: PropTypes.func.isRequired,
};
