import PropTypes from 'prop-types';
import { Square } from "../Square/Square"
import "./Grid.css"

const Grid = ({ square, onClick, gridSize, disabled }) => {
  return (
    <div className="square" style={{ gridTemplateColumns: `repeat(${gridSize}, 6rem)` }}>
      {square.map((value, idx) => {
        return <Square key={idx} value={value} onClick={() => !disabled && value === null && onClick(idx)} />;
      })}
    </div>
  )
}

Grid.propTypes = {
  square: PropTypes.arrayOf(PropTypes.oneOf([null, 'X', 'O'])).isRequired,
  onClick: PropTypes.func.isRequired,
  gridSize: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
};

Grid.defaultProps = {
  disabled: false,
};

export default Grid