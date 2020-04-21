
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function NewTask(props) {
    const {
        creating,
        handleCreate,
        setCreating,
    } = props;

    const defaults = {
        name: '',
        frequency: 0
    };

    const [name, setName] = useState(defaults.name);
    const [frequency, setFrequency] = useState(defaults.frequency);

    function handleSubmit(evt) {
        evt.preventDefault();
        handleCreate({
            name,
            frequency
        });
        discard();
    }

    function discard() {
        setName(defaults.name);
        setFrequency(defaults.frequency);
        setCreating(false);
    }

    const disableSave = name === defaults.name || frequency === defaults.frequency;

    function handleFrequencyChange(event) {
        let parsedInput = 0;
        if (event.target.value !== '') {
            parsedInput = parseInt(event.target.value, 10);
        }
        setFrequency(parsedInput);
    }

    function onAddNewTask() {
        setCreating(true);
    }

    if (!creating) {
        return <div><Button variant="contained" color="primary" onClick={onAddNewTask}>Add new task</Button></div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                id="name"
                label="Name"
                variant="outlined"
                value={name}
                onChange={e => setName(e.target.value)}
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
                onChange={handleFrequencyChange}
            />
            <Button variant="contained" color="primary" type='submit' disabled={disableSave}>Create</Button>
            <Button variant="contained" color="secondary" onClick={discard}>Discard</Button>
        </form>
    );
}

NewTask.propTypes = {
    creating: PropTypes.bool.isRequired,
    handleCreate: PropTypes.func.isRequired,
    setCreating: PropTypes.func.isRequired
};