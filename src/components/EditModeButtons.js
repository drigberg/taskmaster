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
      <div>
        <button variant="contained" color="primary" onClick={onSave}>
          💾 Save changes
        </button>
        <button
          variant="contained"
          color="secondary"
          onClick={onDiscardChanges}
        >
          🗑 Discard changes
        </button>
      </div>
    );
  }

  return (
    <button
      variant="contained"
      color="primary"
      onClick={() => setEditMode(true)}
    >
      📝 Edit
    </button>
  );
}

EditModeButtons.propTypes = {
  editMode: PropTypes.bool.isRequired,
  setEditMode: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDiscardChanges: PropTypes.func.isRequired,
};
