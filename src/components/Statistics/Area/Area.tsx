import { polygonColorOptions } from '../../constants';
import IndividualArea from './Individual';
import IntersectionArea from './Intersection';
import StackedArea from './Stacked';
import UnionArea from './Union';
import { useSolutionContext } from '../../../context/SolutionContext';

function Area() {
  const { selectedPolygonIndexes } = useSolutionContext();

  if (selectedPolygonIndexes.length < 1) return null;

  return (
    <ul className="fa-ul ms-4 text-end font-monospace">
      {/* Right aligned, and monospaced so that it's easier to compare the numbers (spreadsheet style) */}
      {selectedPolygonIndexes.map((value) => {
        return (
          <IndividualArea
            polygonIndex={value}
            key={`${polygonColorOptions[value]}-polygon`}
          />
        );
      })}

      <StackedArea />
      <UnionArea />
      <IntersectionArea />
    </ul>
  );
}

export default Area;
