import PropTypes from 'prop-types';
import "./Square.css";

const Square = ({ value, onClick, disabled }) => {
  const style = value === "X" ? "box x" : "box o";

  return (
    <button className={style} onClick={onClick} disabled={disabled}>{value}</button>
  );
};

Square.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Square.defaultProps = {
  value: null,
  disabled: false,
};

export {Square};