import React from "react";
import PropTypes from "prop-types";

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
          💾 Save Changes
        </button>
        <button
          key="discard"
          variant="contained"
          color="secondary"
          onClick={onDiscardChanges}
        >
          🗑 Discard Changes
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
      📝 Edit Tasks
    </button>
  );
}

EditModeButtons.propTypes = {
  editMode: PropTypes.bool.isRequired,
  setEditMode: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDiscardChanges: PropTypes.func.isRequired,
};
