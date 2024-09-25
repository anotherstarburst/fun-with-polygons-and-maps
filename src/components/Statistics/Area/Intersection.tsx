import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSolutionContext } from '../../../context/SolutionContext';
import IntersectionAreaIcon from '../../icons/IntersectionAreaIcon';
import { useStatisticsContext } from '../../../context/StatisticsContext';

const IntersectionArea = () => {
  const { intersectionArea } = useStatisticsContext();
  const { selectedPolygonIndexes } = useSolutionContext();

  if (isNaN(intersectionArea)) return null;

  return (
    <OverlayTrigger
      placement="auto"
      overlay={
        <Tooltip>Area of the intersection of the selected polygons.</Tooltip>
      }
    >
      <li title="Intersection area">
        <span className="fa-li">
          <IntersectionAreaIcon
            selectedPolygonIndexes={selectedPolygonIndexes}
          />
        </span>
        {Math.floor(intersectionArea).toLocaleString()} m<sup>2</sup>
      </li>
    </OverlayTrigger>
  );
};

export default IntersectionArea;
