import React from 'react';
import PropTypes from 'prop-types';

export default function Task(props) {
    const {
        id,
        name,
        frequency,
        daysSinceCompleted,
        severity,
        archived,
        editMode,
        handleChange,
        handleTaskCompletion,
    } = props;

    let lastCompletedString = 'never';
    if (daysSinceCompleted !== null) {
        if (daysSinceCompleted === 0) {
            lastCompletedString = 'today';
        } else if (daysSinceCompleted === 1) {
            lastCompletedString = '1 day ago';
        } else {
            lastCompletedString = `${daysSinceCompleted} days ago`;
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
        <div key={name} className={`card ${severity}`}>
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
    daysSinceCompleted: PropTypes.number,
    daysOverdue: PropTypes.number,
    severity: PropTypes.string,
    archived: PropTypes.bool.isRequired,
    completionDates: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleTaskCompletion: PropTypes.func.isRequired,
};
