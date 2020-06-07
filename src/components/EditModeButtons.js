import React from 'react';
import PropTypes from 'prop-types';

export default function EditModeButtons(props) {
    const { editMode, setEditMode, handleSave, handleDiscardChanges } = props;

    function onSave() {
        handleSave();
        setEditMode(false);
    }

    function onDiscardChanges() {
        handleDiscardChanges();
        setEditMode(false);
    }

    if (editMode) {
        return (
            <>
                <button key="save" variant="contained" color="primary" onClick={onSave}>
                    <span role="img" aria-label="floppydisk">💾</span> Save Changes
                </button>
                <button
                    key="discard"
                    variant="contained"
                    color="secondary"
                    onClick={onDiscardChanges}
                >
                    <span role="img" aria-label="trashcan">🗑</span> Discard Changes
                </button>
            </>
        );
    }

    return (
        <button
            key="edit"
            variant="contained"
            color="primary"
            onClick={() => setEditMode(true)}
        >
            <span role="img" aria-label="paper-and-pencil">📝</span> Edit Tasks
        </button>
    );
}

EditModeButtons.propTypes = {
    editMode: PropTypes.bool.isRequired,
    setEditMode: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleDiscardChanges: PropTypes.func.isRequired,
};
