import "./index.css";

const EditableRow = (props) => {
  const {
    id,
    userName,
    userEmail,
    userRole,

    onChangeRowSelection,
    cancelEdit,
    isRowSelected,

    handleUsernameChange,
    handleUserEmailChange,
    handleUserRoleChange,
  } = props;

  const handleCancelEdit = () => {
    cancelEdit(id);
  };

  const onChangeRowSelected = () => {
    onChangeRowSelection(id);
  };

  const editUserName = (event) => {
    handleUsernameChange(event);
  };

  const editUserEmail = (event) => {
    handleUserEmailChange(event);
  };

  const editUserRole = (event) => {
    handleUserRoleChange(event);
  };

  const highLightRowClassName = isRowSelected ? "row-high-light" : "";
  const separatorLine = isRowSelected ? "separator-highlight" : "separator";
  return (
    <li className={`table-row ${highLightRowClassName}`}>
      <input
        type="checkbox"
        checked={isRowSelected}
        className="table-row-cell all-rows-checkbox"
        onChange={onChangeRowSelected}
      />
      <input
        onChange={editUserName}
        type="text"
        name="name"
        value={userName}
        className="table-row-cell user-name input-field"
      />
      <hr className={separatorLine} />
      <input
        onChange={editUserEmail}
        type="text"
        name="email"
        value={userEmail}
        className="table-row-cell user-email input-field"
      />
      <hr className={separatorLine} />
      <input
        onChange={editUserRole}
        type="text"
        name="role"
        value={userRole}
        className="table-row-cell user-role input-field"
      />
      <hr className={separatorLine} />
      <div className="table-row-cell user-action">
        <button value={id} type="submit" className="save-button">
          Save
        </button>

        <button
          value={id}
          onClick={handleCancelEdit}
          type="button"
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </li>
  );
};

export default EditableRow;
