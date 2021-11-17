import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import "./index.css";

const ReadOnlyRow = (props) => {
  const { userDetails, onChangeRowSelection, setEditRowId, deleteUser } = props;
  const { name, email, role, isRowSelected, id } = userDetails;

  const onClickedDeleteUserRow = () => {
    deleteUser(id);
  };

  const onChangeRowSelected = () => {
    onChangeRowSelection(id);
  };

  const onClickedEditRow = () => {
    setEditRowId(id);
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
      <p className="table-row-cell user-name">{name}</p>
      <hr className={separatorLine} />
      <p className="table-row-cell user-email">{email}</p>
      <hr className={separatorLine} />
      <p className="table-row-cell user-role">{role}</p>
      <hr className={separatorLine} />
      <div className="table-row-cell user-action">
        <button
          onClick={onClickedEditRow}
          value={id}
          type="button"
          className="delete-button"
        >
          <FaRegEdit className="row-icon edit-icon" value={id} />
        </button>

        <button
          onClick={onClickedDeleteUserRow}
          value={id}
          type="button"
          className="delete-button"
        >
          <MdDeleteOutline className="row-icon delete-icon" />
        </button>
      </div>
    </li>
  );
};

export default ReadOnlyRow;
