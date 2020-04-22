import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function NewTask(props) {
    const { creating, handleCreate, setCreating } = props;

    const defaults = {
        name: '',
        frequency: '0',
    };

    const [name, setName] = useState(defaults.name);
    const [frequency, setFrequency] = useState(defaults.frequency);

    function handleSubmit(evt) {
        evt.preventDefault();
        handleCreate({
            name,
            frequency: parseInt(frequency, 10),
        });
        discard();
    }

    function discard() {
        setName(defaults.name);
        setFrequency(defaults.frequency);
        setCreating(false);
    }

    const disableSave =
    name === defaults.name || ['', defaults.frequency].includes(frequency);

    function onAddNewTask() {
        setCreating(true);
    }

    if (!creating) {
        return (
            <button variant="contained" color="primary" onClick={onAddNewTask}>
        ➕Add new task
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">What is your task?</label>
                <input
                    id="name"
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="frequency">How often do you want to do it?</label>
                <input
                    id="frequency"
                    label="Frequency In Days"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                />
            </div>
            <button
                variant="contained"
                color="primary"
                type="submit"
                disabled={disableSave}
            >
        ✓ Create
            </button>
            <button variant="contained" color="secondary" onClick={discard}>
        🗑 Discard
            </button>
        </form>
    );
}

NewTask.propTypes = {
    creating: PropTypes.bool.isRequired,
    handleCreate: PropTypes.func.isRequired,
    setCreating: PropTypes.func.isRequired,
};
