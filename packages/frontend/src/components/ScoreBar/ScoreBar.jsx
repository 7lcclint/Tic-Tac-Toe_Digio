import PropTypes from 'prop-types';
import { useEffect } from 'react';
import "./ScoreBar.css"

const ScoreBar = ({ scores, xPlaying, playerXName, playerOName }) => {
  const { xScore, oScore } = scores;

  useEffect(() => {
    if (playerXName && playerOName) {
      alert(`Welcome ${playerXName} (X) and ${playerOName} (O)! Let's play!`);
    }
  }, [playerXName, playerOName]);

  return (
    <div className="scoreboard">
      <span className={`score x-score ${!xPlaying && "inactive"}`}>
        {playerXName} (X) - {xScore}
      </span>
      <span className={`score o-score ${xPlaying && "inactive"}`}>
        {playerOName} (O) - {oScore}
      </span>
    </div>
  );
}

ScoreBar.propTypes = {
  scores: PropTypes.shape({
    xScore: PropTypes.number.isRequired,
    oScore: PropTypes.number.isRequired,
  }).isRequired,
  xPlaying: PropTypes.bool.isRequired,
  playerXName: PropTypes.string,
  playerOName: PropTypes.string,
};

export default ScoreBar;