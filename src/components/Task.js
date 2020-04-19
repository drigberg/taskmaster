
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function Task(props) {
    const {
        name,
        frequency,
        completionDates,
        editMode
    } = props;

    let lastCompletedString = 'never';
    if (completionDates.length) {
        const lastCompleted = completionDates[completionDates.length - 1];
        const msSinceCompleted = (new Date() - new Date(lastCompleted));
        const daysSinceCompleted = msSinceCompleted / (24 * 60 * 60 * 1000);
        const roundedDays = Math.round(daysSinceCompleted);
        lastCompletedString = `${roundedDays} days ago`;
    }

    if (editMode) {
        return (
            <div key={name}>
                <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    value={name}
                />
                <TextField
                    id="frequency"
                    label="Frequency In Days"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    value={frequency}
                />
                <Button variant="contained" color="secondary">Archive</Button>
            </div>
        );
    }

    return (
        <div key={name}>
            <h4>{name} every {frequency} days</h4>
            <p>Last completed: {lastCompletedString}</p>
            <Button variant="contained" color="primary">Done</Button>
        </div>
    );
}

Task.propTypes = {
    name: PropTypes.string,
    editMode: PropTypes.bool,
    frequency: PropTypes.number,
    completionDates: PropTypes.array.isRequired,
};