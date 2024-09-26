import { useSolutionContext } from '../../context/SolutionContext';

import Area from './Area/Area';
import Tools from './Tools/Tools';

function Statistics() {
  const { selectedPolygonIndexes } = useSolutionContext();

  if (selectedPolygonIndexes.length < 1) {
    return (
      <div className="d-flex flex-column h-100 justify-content-center align-items-center">
        <p>Please select a polygon to start.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100 justify-content-between">
      <Area />

      <Tools />
    </div>
  );
}

export default Statistics;
