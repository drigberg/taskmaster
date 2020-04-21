
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function Task(props) {
    const {
        id,
        name,
        frequency,
        completionDates,
        editMode,
        handleChange
    } = props;


    let className = 'healthy';
    let lastCompletedString = 'never';
    if (completionDates.length) {
        // assume sorted
        const lastCompleted = completionDates[completionDates.length - 1];
        const msSinceCompleted = (new Date() - new Date(lastCompleted));
        const daysSinceCompleted = msSinceCompleted / (24 * 60 * 60 * 1000);
        const roundedDays = Math.round(daysSinceCompleted);
        lastCompletedString = `${roundedDays} days ago`;

        // determine health of task based on last completion
        if (roundedDays > frequency && roundedDays < frequency * 2) {
            className = 'warning';
        } else {
            className = 'error';
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
            <div key={name}>
                <TextField
                    id={name}
                    label="Name"
                    variant="outlined"
                    defaultValue={name}
                    onChange={onNameChange}
                />
                <TextField
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
                <Button variant="contained" color="secondary" onClick={setArchived}>Archive</Button>
            </div>
        );
    }

    return (
        <div key={name} className={className}>
            <h4>{name} every {frequency} days</h4>
            <p>Last completed: {lastCompletedString}</p>
            <Button variant="contained" color="primary">Done</Button>
        </div>
    );
}

Task.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    editMode: PropTypes.bool,
    frequency: PropTypes.number,
    completionDates: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired
};