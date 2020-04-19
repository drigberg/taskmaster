
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import Task from './Task';

function getEditModeButtons(editMode, setEditMode) {
    if (editMode) {
        return <div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(false)}
            >Save Changes</Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => setEditMode(false)}
            >Discard Changes</Button>
        </div>;
    }
    return <div>
        <Button
            variant="contained"
            color="primary"
            onClick={() => setEditMode(true)}
        >Edit Tasks</Button>
    </div>;
}

export default function Dashboard(props) {
    const {
        userName,
        fetching,
        errorMessage,
        tasks,
    } = props;

    const [editMode, setEditMode] = useState(false);

    let body = null;

    if (fetching) {
        body = <div><p>Fetching data...</p></div>;
    } else if (errorMessage) {
        body = <div><p>Error: {errorMessage}</p></div>;
    } else {
        body = <div>
            {getEditModeButtons(editMode, setEditMode)}
            <ul>
                {tasks.map(({name, frequency, completionDates}) => (
                    <Task 
                        key={name}
                        name={name}
                        frequency={frequency}
                        completionDates={completionDates}
                        editMode={editMode}
                    />))}
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
    userName: PropTypes.string,
    fetching: PropTypes.bool,
    errorMessage: PropTypes.string,
    tasks: PropTypes.array.isRequired
};