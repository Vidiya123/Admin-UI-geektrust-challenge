import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ReadOnlyRow from '../ReadOnlyRow'
import EditableRow from '../EditableRow'
import Pagination from '../Pagination'

import './index.css'

const apiStatusOptions = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const paginationList = [
  {
    id: 1,
    name: 'PAGE_1',
  },
  {
    id: 2,
    name: 'PAGE_2',
  },
  {
    id: 3,
    name: 'PAGE_3',
  },
  {
    id: 4,
    name: 'PAGE_4',
  },
  {
    id: 5,
    name: 'PAGE_5',
  },
]

class AdminUI extends Component {
  constructor(props) {
    super(props)

    this.state = {
      usersList: [],
      apiStatus: apiStatusOptions.loading,
      searchInput: '',
      editRowId: null,
      currentPage: 1,
      totalRows: 0,
      isAllRowsSelected: false,
      userName: '',
      userEmail: '',
      userRole: '',
    }
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  componentDidMount() {
    this.fetchUserList()
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="TailSpin" color="#0b69ff" height="50" width="50" />
    </div>
  )

  fetchUserList = async () => {
    const {currentPage, searchInput} = this.state
    const ROWS_LIMIT = 10
    const ROWS_OFFSET = (currentPage - 1) * ROWS_LIMIT
    const USER_LIST_API_URL = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json?limit=${ROWS_LIMIT}&offset=${ROWS_OFFSET}`
    this.setState({isAllRowsSelected: false})
    console.log('after retry button')
    const options = {
      method: 'GET',
      headers: {
        accept: 'applications/json',
      },
    }

    this.setState({apiStatus: apiStatusOptions.loading})

    const apiResponse = await fetch(USER_LIST_API_URL, options)

    if (apiResponse.ok) {
      const userList = await apiResponse.json()
      const updatedUserList = userList.map(user => ({
        ...user,
        isRowSelected: false,
      }))

      const SEARCH_DATA = searchInput.toUpperCase()

      const filteredUserList = updatedUserList.filter(
        user =>
          user.name.toUpperCase().includes(SEARCH_DATA) ||
          user.email.toUpperCase().includes(SEARCH_DATA) ||
          user.role.toUpperCase().includes(SEARCH_DATA),
      )
      this.setState({totalRows: filteredUserList.length})
      const paginationUserList = filteredUserList.slice(
        ROWS_OFFSET,
        ROWS_OFFSET + ROWS_LIMIT,
      )

      this.setState({
        usersList: paginationUserList,
        apiStatus: apiStatusOptions.success,
      })
    } else {
      this.setState({apiStatus: apiStatusOptions.failure})
    }
  }

  handleOnChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.fetchUserList)
  }

  updateAllRowsSelection = event => {
    this.setState(prevState => ({
      usersList: prevState.usersList.map(user => ({
        ...user,
        isRowSelected: event.target.checked,
      })),
    }))
  }

  onchangeAllRowsCheckBox = event => {
    this.setState(
      {isAllRowsSelected: event.target.checked},
      this.updateAllRowsSelection(event),
    )
  }

  deleteSelectedRows = () => {
    const {usersList} = this.state
    const unSelectedRows = usersList.filter(
      user => user.isRowSelected === false,
    )
    this.setState({usersList: unSelectedRows})
  }

  handlePageChange = event => {
    switch (event.target.value) {
      case 'FIRST_PAGE':
        this.setState({currentPage: 1}, this.fetchUserList)
        break
      case 'PREV_PAGE':
        this.setState(
          prevState => ({
            currentPage:
              prevState.currentPage > 1
                ? prevState.currentPage - 1
                : prevState.currentPage,
          }),
          this.fetchUserList,
        )
        break
      case 'LAST_PAGE':
        this.setState(
          prevState => ({
            currentPage:
              prevState.totalRows > prevState.currentPage * 10
                ? Math.ceil(prevState.totalRows / 10)
                : prevState.currentPage,
          }),
          this.fetchUserList,
        )
        break
      case 'NEXT_PAGE':
        this.setState(
          prevState => ({
            currentPage:
              prevState.currentPage < 5
                ? prevState.currentPage + 1
                : prevState.currentPage,
          }),
          this.fetchUserList,
        )
        break
      case 'PAGE_1':
        this.setState({currentPage: 1}, this.fetchUserList)
        break
      case 'PAGE_2':
        this.setState({currentPage: 2}, this.fetchUserList)
        break
      case 'PAGE_3':
        this.setState({currentPage: 3}, this.fetchUserList)
        break
      case 'PAGE_4':
        this.setState({currentPage: 4}, this.fetchUserList)
        break
      case 'PAGE_5':
        this.setState({currentPage: 5}, this.fetchUserList)
        break

      default:
        break
    }
  }

  setEditRowId = id => {
    this.setState({editRowId: id}, this.passExistingRowData)
  }

  passExistingRowData = () => {
    const {editRowId, usersList} = this.state
    const editRowIndex = usersList.findIndex(user => user.id === editRowId)

    const currentEditingRow = usersList[editRowIndex]

    this.setState({
      userName: currentEditingRow.name,
      userEmail: currentEditingRow.email,
      userRole: currentEditingRow.role,
    })
  }

  onChangeRowSelection = id => {
    this.setState(prevState => ({
      usersList: prevState.usersList.map(user =>
        user.id === id
          ? {...user, isRowSelected: !user.isRowSelected}
          : {...user},
      ),
    }))
  }

  deleteUser = id => {
    const {usersList} = this.state
    const unDeletedUserList = usersList.filter(user => user.id !== id)
    this.setState({usersList: unDeletedUserList})
  }

  handleEditFormSubmit = event => {
    event.preventDefault()

    const {editRowId, usersList, userName, userEmail, userRole} = this.state

    const updatedUserList = usersList.map(user => {
      if (user.id === editRowId) {
        const currentUser = {
          name: userName,
          email: userEmail,
          role: userRole,
          id: user.id,
          isRowSelected: user.isRowSelected,
        }
        return currentUser
      }

      return user
    })

    this.setState({
      usersList: updatedUserList,
      editRowId: null,
    })
  }

  cancelEdit = () => {
    this.setState({
      editRowId: null,
    })
  }

  onChangeUserName = event => {
    this.setState({userName: event.target.value})
  }

  onChangeUserEmail = event => {
    this.setState({userEmail: event.target.value})
  }

  onChangeUserRole = event => {
    this.setState({userRole: event.target.value})
  }

  renderSuccessView = () => {
    const {
      usersList,
      currentPage,
      totalRows,
      editRowId,
      userName,
      userEmail,
      userRole,
    } = this.state

    const IS_FIRST_PAGE_BUTTON_DISABLE = currentPage === 1
    const IS_LAST_PAGE_BUTTON_DISABLE = totalRows < currentPage * 10

    const PrevButtonStatusClassName = IS_FIRST_PAGE_BUTTON_DISABLE
      ? 'in-active-special-icon'
      : 'active-special-icon'

    const NextButtonStatusClassName = IS_LAST_PAGE_BUTTON_DISABLE
      ? 'in-active-special-icon'
      : 'active-special-icon'

    return (
      <>
        <ul className="rows-container">
          {usersList.length > 0 ? (
            usersList.map(eachUser => (
              <>
                <form
                  onSubmit={this.handleEditFormSubmit}
                  className="edit-form-container"
                >
                  {eachUser.id === editRowId ? (
                    <EditableRow
                      key={eachUser.id}
                      buttonDisableStatus={usersList.length < currentPage * 10}
                      isRowSelected={eachUser.isRowSelected}
                      id={editRowId}
                      onChangeUserName={this.onChangeUserName}
                      onChangeUserEmail={this.onChangeUserEmail}
                      onChangeUserRole={this.onChangeUserRole}
                      onChangeRowSelection={this.onChangeRowSelection}
                      userName={userName}
                      userEmail={userEmail}
                      userRole={userRole}
                      cancelEdit={this.cancelEdit}
                    />
                  ) : (
                    <ReadOnlyRow
                      key={eachUser.id}
                      buttonDisableStatus={usersList.length < currentPage * 10}
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

            {paginationList.map(eachButton => (
              <Pagination
                currentPage={currentPage}
                key={eachButton.id}
                isButtonDisabled={totalRows < (eachButton.id - 1) * 10}
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
    )
  }

  gotoFetch = () => {
    this.fetchUserList()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <h1 className="failure-heading">Something went Wrong !!!</h1>
      <button onClick={this.gotoFetch} type="button" className="retry-button">
        Retry
      </button>
    </div>
  )

  renderUI = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusOptions.success:
        return this.renderSuccessView()
      case apiStatusOptions.failure:
        return this.renderFailureView()
      case apiStatusOptions.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput, isAllRowsSelected} = this.state
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
            <li className="table-row">
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
    )
  }
}

export default AdminUI
