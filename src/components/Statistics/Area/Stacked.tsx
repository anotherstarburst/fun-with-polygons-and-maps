import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSolutionContext } from '../../../context/SolutionContext';
import StackedAreaIcon from '../../icons/StackedAreaIcon';
import { useStatisticsContext } from '../../../context/StatisticsContext';

const StackedArea = () => {
  const { selectedPolygonIndexes } = useSolutionContext();
  const { stackedArea } = useStatisticsContext();
  if (selectedPolygonIndexes.length < 2) return null;

  return (
    <OverlayTrigger
      placement="auto"
      overlay={<Tooltip>Sum of the area of the selected polygons.</Tooltip>}
    >
      <li>
        <span className="fa-li">
          <StackedAreaIcon selectedPolygonIndexes={selectedPolygonIndexes} />
        </span>
        {Math.floor(stackedArea).toLocaleString()} m<sup>2</sup>
      </li>
    </OverlayTrigger>
  );
};

export default StackedArea;
