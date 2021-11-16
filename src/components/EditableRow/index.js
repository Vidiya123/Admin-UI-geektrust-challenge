import './index.css'

const EditableRow = props => {
  const {
    id,
    userName,
    userEmail,
    userRole,
    onChangeRowSelection,
    cancelEdit,
    isRowSelected,

    onChangeUserName,
    onChangeUserEmail,
    onChangeUserRole,
  } = props

  const onClickedCancelEdit = () => {
    cancelEdit(id)
  }

  const onChangeRowSelected = () => {
    onChangeRowSelection(id)
  }

  const editUserName = event => {
    onChangeUserName(event)
  }

  const editUserEmail = event => {
    onChangeUserEmail(event)
  }

  const editUserRole = event => {
    onChangeUserRole(event)
  }

  const highLightRowClassName = isRowSelected ? 'row-high-light' : ''
  const separatorLine = isRowSelected ? 'separator-highlight' : 'separator'
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
          onClick={onClickedCancelEdit}
          type="button"
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </li>
  )
}

export default EditableRow
