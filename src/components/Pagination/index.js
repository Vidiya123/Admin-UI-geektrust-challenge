import './index.css'

const Pagination = props => {
  const {buttonDetails, isButtonDisabled, handlePageChange, currentPage} = props
  const buttonStatusClassName = isButtonDisabled
    ? 'in-active-button'
    : 'active-button'
  const {id, name} = buttonDetails
  const onClickPageChanged = event => {
    handlePageChange(event)
  }
  const currentPageClassName =
    currentPage === id ? 'active-page' : buttonStatusClassName

  return (
    <button
      type="button"
      disabled={isButtonDisabled}
      value={name}
      onClick={onClickPageChanged}
      className={`pagination-number-icon ${currentPageClassName}`}
    >
      {id}
    </button>
  )
}

export default Pagination
