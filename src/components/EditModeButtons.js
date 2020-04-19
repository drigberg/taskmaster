
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

export default function EditModeButtons(props) {
    const {
        editMode,
        setEditMode,
        handleSave,
        handleDiscardChanges
    } = props;

    function onSave() {
        handleSave();
        setEditMode(false);
    }

    function onDiscardChanges() {
        handleDiscardChanges();
        setEditMode(false);
    }

    if (editMode) {
        return <div>
            <Button
                variant="contained"
                color="primary"
                onClick={onSave}
            >Save Changes</Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={onDiscardChanges}
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

EditModeButtons.propTypes = {
    editMode: PropTypes.bool.isRequired,
    setEditMode: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleDiscardChanges: PropTypes.func.isRequired,
};
