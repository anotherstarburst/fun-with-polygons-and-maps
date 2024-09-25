import { faRuler } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { polygonColorOptions } from '../../constants';
import IndividualArea from './Individual';
import IntersectionArea from './Intersection';
import StackedArea from './Stacked';
import AreaUnion from './Union';
import { useSolutionContext } from '../../../context/SolutionContext';

function Area(props: {
  stackedArea: number;
  intersectionArea: number;
  unionArea: number;
}) {
  const { stackedArea, intersectionArea, unionArea } = props;
  const { selectedPolygonIndexes } = useSolutionContext();

  if (selectedPolygonIndexes.length < 1) return null;

  return (
    <div>
      <p className="text-secondary fs-4">
        <FontAwesomeIcon icon={faRuler} className="me-1" />
        Area
      </p>

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

        <StackedArea stackedArea={stackedArea} />
        <AreaUnion unionArea={unionArea} />
        <IntersectionArea intersectionArea={intersectionArea} />
      </ul>
    </div>
  );
}

export default Area;
