
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
        archived,
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

    function setArchived(val) {
        handleChange(id, { archived: val });
    }

    if (editMode) {
        let archiveToggleButton;
        if (archived) {
            // onMouseDown used because onClick doesn't fire if onBlur is firing
            // from an input at the same time.
            // (see https://stackoverflow.com/questions/44142273/react-ul-with-onblur-event-is-preventing-onclick-from-firing-on-li)
            archiveToggleButton = <Button
                variant="contained"
                color="secondary"
                onMouseDown={() => setArchived(false)}>Unarchive</Button>;
        } else {
            archiveToggleButton = <Button
                variant="contained"
                color="secondary"
                onMouseDown={() => setArchived(true)}>Archive</Button>;
        }
        return (
            <div key={name}>
                <TextField
                    id={name}
                    label="Name"
                    variant="outlined"
                    defaultValue={name}
                    onBlur={onNameChange}
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
                    onBlur={onFrequencyChange}
                />
                {archiveToggleButton}
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
    id: PropTypes.string,
    name: PropTypes.string,
    editMode: PropTypes.bool,
    frequency: PropTypes.number,
    archived: PropTypes.bool.isRequired,
    completionDates: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired
};