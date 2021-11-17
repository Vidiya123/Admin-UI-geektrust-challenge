import { Component } from "react";
import Loader from "react-loader-spinner";
import ReadOnlyRow from "../ReadOnlyRow";
import EditableRow from "../EditableRow";
import Pagination from "../Pagination";

import "./index.css";

const MAX_NO_OF_ROWS_PER_PAGE = 10;

const apiStatusOptions = {
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

const paginationList = [
  {
    id: 1,
    name: "PAGE_1",
  },
  {
    id: 2,
    name: "PAGE_2",
  },
  {
    id: 3,
    name: "PAGE_3",
  },
  {
    id: 4,
    name: "PAGE_4",
  },
  {
    id: 5,
    name: "PAGE_5",
  },
];

class AdminUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usersList: [],
      apiStatus: apiStatusOptions.loading,
      searchInput: "",
      editRowId: null,
      currentPage: 1,
      totalRows: 0,
      isAllRowsSelected: false,
      userName: "",
      userEmail: "",
      userRole: "",
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.fetchUserListAPI();
  }

  fetchUserListAPI = async () => {
    const { currentPage, searchInput } = this.state;
    let ROWS_OFFSET = (currentPage - 1) * MAX_NO_OF_ROWS_PER_PAGE;
    const USER_LIST_API_END_POINT = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json?limit=${MAX_NO_OF_ROWS_PER_PAGE}&offset=${ROWS_OFFSET}`;
    this.setState({ isAllRowsSelected: false });
    const options = {
      method: "GET",
      headers: {
        accept: "applications/json",
      },
    };

    this.setState({ apiStatus: apiStatusOptions.loading });

    const apiResponseObject = await fetch(USER_LIST_API_END_POINT, options);

    if (apiResponseObject.ok) {
      const userList = await apiResponseObject.json();
      const updatedUserList = userList.map((user) => ({
        ...user,
        isRowSelected: false,
      }));

      const SEARCH_DATA = searchInput.toUpperCase();

      const filteredUserList = updatedUserList.filter(
        (user) =>
          user.name.toUpperCase().includes(SEARCH_DATA) ||
          user.email.toUpperCase().includes(SEARCH_DATA) ||
          user.role.toUpperCase().includes(SEARCH_DATA)
      );

      const TOTAL_ROWS = filteredUserList.length;
      this.setState({ totalRows: TOTAL_ROWS });

      const doMoveToFirstPage =
        TOTAL_ROWS <= (currentPage - 1) * MAX_NO_OF_ROWS_PER_PAGE;

      if (doMoveToFirstPage) {
        this.setState({ currentPage: 1 });
        ROWS_OFFSET = 0;
      } else {
        ROWS_OFFSET = (currentPage - 1) * MAX_NO_OF_ROWS_PER_PAGE;
      }

      const currentPageUserRows = filteredUserList.slice(
        ROWS_OFFSET,
        ROWS_OFFSET + MAX_NO_OF_ROWS_PER_PAGE
      );
      this.setState({
        usersList: currentPageUserRows,
        apiStatus: apiStatusOptions.success,
      });
    } else {
      this.setState({ apiStatus: apiStatusOptions.failure });
    }
  };

  handleOnChangeSearchInput = (event) => {
    this.setState({ searchInput: event.target.value }, this.fetchUserListAPI);
  };

  updateAllRowsSelection = (event) => {
    this.setState((prevState) => ({
      usersList: prevState.usersList.map((user) => ({
        ...user,
        isRowSelected: event.target.checked,
      })),
    }));
  };

  onchangeAllRowsCheckBox = (event) => {
    this.setState(
      { isAllRowsSelected: event.target.checked },
      this.updateAllRowsSelection(event)
    );
  };

  deleteSelectedRows = () => {
    const { usersList } = this.state;
    const unSelectedRows = usersList.filter(
      (user) => user.isRowSelected === false
    );
    this.setState({ usersList: unSelectedRows });
  };

  handlePageChange = (event) => {
    switch (event.target.value) {
      case "FIRST_PAGE":
        this.setState({ currentPage: 1 }, this.fetchUserListAPI);
        break;
      case "PREV_PAGE":
        this.setState(
          (prevState) => ({
            currentPage:
              prevState.currentPage > 1
                ? prevState.currentPage - 1
                : prevState.currentPage,
          }),
          this.fetchUserListAPI
        );
        break;
      case "LAST_PAGE":
        this.setState(
          (prevState) => ({
            currentPage:
              prevState.totalRows >
              prevState.currentPage * MAX_NO_OF_ROWS_PER_PAGE
                ? Math.ceil(prevState.totalRows / MAX_NO_OF_ROWS_PER_PAGE)
                : prevState.currentPage,
          }),
          this.fetchUserListAPI
        );
        break;
      case "NEXT_PAGE":
        this.setState(
          (prevState) => ({
            currentPage:
              prevState.currentPage < 5
                ? prevState.currentPage + 1
                : prevState.currentPage,
          }),
          this.fetchUserListAPI
        );
        break;
      case "PAGE_1":
        this.setState({ currentPage: 1 }, this.fetchUserListAPI);
        break;
      case "PAGE_2":
        this.setState({ currentPage: 2 }, this.fetchUserListAPI);
        break;
      case "PAGE_3":
        this.setState({ currentPage: 3 }, this.fetchUserListAPI);
        break;
      case "PAGE_4":
        this.setState({ currentPage: 4 }, this.fetchUserListAPI);
        break;
      case "PAGE_5":
        this.setState({ currentPage: 5 }, this.fetchUserListAPI);
        break;

      default:
        break;
    }
  };

  setEditRowId = (id) => {
    this.setState({ editRowId: id }, this.passExistingRowData);
  };

  passExistingRowData = () => {
    const { editRowId, usersList } = this.state;
    const editRowIndex = usersList.findIndex((user) => user.id === editRowId);

    const currentEditingRow = usersList[editRowIndex];

    this.setState({
      userName: currentEditingRow.name,
      userEmail: currentEditingRow.email,
      userRole: currentEditingRow.role,
    });
  };

  onChangeRowSelection = (id) => {
    this.setState((prevState) => ({
      usersList: prevState.usersList.map((user) =>
        user.id === id
          ? { ...user, isRowSelected: !user.isRowSelected }
          : { ...user }
      ),
    }));
  };

  deleteUser = (id) => {
    const { usersList } = this.state;
    const unDeletedUserList = usersList.filter((user) => user.id !== id);
    this.setState({ usersList: unDeletedUserList });
  };

  handleEditFormSubmit = (event) => {
    event.preventDefault();

    const { editRowId, usersList, userName, userEmail, userRole } = this.state;

    const updatedUserList = usersList.map((user) => {
      if (user.id === editRowId) {
        const currentUser = {
          name: userName,
          email: userEmail,
          role: userRole,
          id: user.id,
          isRowSelected: user.isRowSelected,
        };
        return currentUser;
      }

      return user;
    });

    this.setState({
      usersList: updatedUserList,
      editRowId: null,
    });
  };

  cancelEdit = () => {
    this.setState({
      editRowId: null,
    });
  };

  handleUsernameChange = (event) => {
    this.setState({ userName: event.target.value });
  };

  handleUserEmailChange = (event) => {
    this.setState({ userEmail: event.target.value });
  };

  handleUserRoleChange = (event) => {
    this.setState({ userRole: event.target.value });
  };

  renderSuccessView = () => {
    const {
      usersList,
      currentPage,
      totalRows,
      editRowId,
      userName,
      userEmail,
      userRole,
    } = this.state;

    const IS_FIRST_PAGE_BUTTON_DISABLE = currentPage === 1;
    const IS_LAST_PAGE_BUTTON_DISABLE =
      totalRows <= currentPage * MAX_NO_OF_ROWS_PER_PAGE;

    const PrevButtonStatusClassName = IS_FIRST_PAGE_BUTTON_DISABLE
      ? "in-active-special-icon"
      : "active-special-icon";

    const NextButtonStatusClassName = IS_LAST_PAGE_BUTTON_DISABLE
      ? "in-active-special-icon"
      : "active-special-icon";

    return (
      <>
        <ul className="rows-container">
          {usersList.length > 0 ? (
            usersList.map((eachUser) => (
              <>
                <form
                  onSubmit={this.handleEditFormSubmit}
                  className="edit-form-container"
                >
                  {eachUser.id === editRowId ? (
                    <EditableRow
                      key={eachUser.id}
                      buttonDisableStatus={
                        usersList.length < currentPage * MAX_NO_OF_ROWS_PER_PAGE
                      }
                      isRowSelected={eachUser.isRowSelected}
                      id={editRowId}
                      handleUsernameChange={this.handleUsernameChange}
                      handleUserEmailChange={this.handleUserEmailChange}
                      handleUserRoleChange={this.handleUserRoleChange}
                      onChangeRowSelection={this.onChangeRowSelection}
                      userName={userName}
                      userEmail={userEmail}
                      userRole={userRole}
                      cancelEdit={this.cancelEdit}
                    />
                  ) : (
                    <ReadOnlyRow
                      key={eachUser.id}
                      buttonDisableStatus={
                        usersList.length < currentPage * MAX_NO_OF_ROWS_PER_PAGE
                      }
                      onChangeRowSelection={this.onChangeRowSelection}
                      deleteUser={this.deleteUser}
                      setEditRowId={this.setEditRowId}
                      userDetails={eachUser}
                    />
                  )}
                </form>
              </>
            ))
          ) : (
            <p className="no-rows">No records available* </p>
          )}
        </ul>

        <div className="footer-section">
          <button
            className="delete-selected-button"
            type="button"
            onClick={this.deleteSelectedRows}
          >
            Delete Selected
          </button>

          <div className="pagination-container">
            <button
              disabled={IS_FIRST_PAGE_BUTTON_DISABLE}
              onClick={this.handlePageChange}
              type="button"
              className={`pagination-icon ${PrevButtonStatusClassName}`}
              value="FIRST_PAGE"
            >
              {`<<`}
            </button>
            <button
              disabled={IS_FIRST_PAGE_BUTTON_DISABLE}
              onClick={this.handlePageChange}
              type="button"
              className={`pagination-icon ${PrevButtonStatusClassName}`}
              value="PREV_PAGE"
            >
              {`<`}
            </button>

            {paginationList.map((eachButton) => (
              <Pagination
                key={eachButton.id}
                currentPage={currentPage}
                isButtonDisabled={
                  totalRows < (eachButton.id - 1) * MAX_NO_OF_ROWS_PER_PAGE
                }
                buttonDetails={eachButton}
                handlePageChange={this.handlePageChange}
              />
            ))}

            <button
              disabled={IS_LAST_PAGE_BUTTON_DISABLE}
              onClick={this.handlePageChange}
              type="button"
              className={`pagination-icon ${NextButtonStatusClassName}`}
              value="NEXT_PAGE"
            >
              {`>`}
            </button>

            <button
              disabled={IS_LAST_PAGE_BUTTON_DISABLE}
              onClick={this.handlePageChange}
              type="button"
              className={`pagination-icon ${NextButtonStatusClassName}`}
              value="LAST_PAGE"
            >
              {`>>`}
            </button>
          </div>
        </div>
      </>
    );
  };

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#0b69ff" height="50" width="50" />
      <h1 className="loader-heading">
        Please wait, We are fetching your data...{" "}
      </h1>
    </div>
  );

  renderFailureView = () => (
    <div className="failure-container">
      <h1 className="failure-heading">Something went Wrong !!!</h1>
      <button onClick={this.gotoFetch} type="button" className="retry-button">
        Retry
      </button>
    </div>
  );

  gotoFetch = () => {
    this.fetchUserListAPI();
  };

  renderUI = () => {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusOptions.success:
        return this.renderSuccessView();
      case apiStatusOptions.failure:
        return this.renderFailureView();
      case apiStatusOptions.loading:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    const { searchInput, isAllRowsSelected } = this.state;
    console.log(process.env.APP_ENV);
    return (
      <div className="app-container">
        <div className="responsive-container">
          <div className="user-form-container">
            <input
              type="search"
              value={searchInput}
              onChange={this.handleOnChangeSearchInput}
              className="input"
              placeholder="Search by name,email or role"
            />
          </div>

          <ul className="header-container">
            <li className="table-row" key="header">
              <input
                type="checkbox"
                checked={isAllRowsSelected}
                className="table-row-cell all-rows-checkbox"
                onChange={this.onchangeAllRowsCheckBox}
              />
              <p className="table-header-cell user-name">Name</p>
              <hr className="separator" />
              <p className="table-header-cell user-email">Email</p>
              <hr className="separator" />
              <p className="table-header-cell user-role">Role</p>
              <hr className="separator" />
              <p className="table-header-cell user-action">Action</p>
            </li>
          </ul>
          {this.renderUI()}
        </div>
      </div>
    );
  }
}

export default AdminUI;
