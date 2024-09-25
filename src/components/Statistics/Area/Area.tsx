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
    <div className="mt-3">
      {/* Right aligned, and monospaced so that it's easier to compare the numbers (spreadsheet style) */}
      <ul className="fa-ul ms-4 text-end font-monospace">
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
    </div>
  );
}

export default Area;
