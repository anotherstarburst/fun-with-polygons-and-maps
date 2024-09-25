import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSolutionContext } from '../../../context/SolutionContext';
import UnionAreaIcon from '../../icons/UnionAreaIcon';
import { useStatisticsContext } from '../../../context/StatisticsContext';

const AreaUnion = () => {
  const { unionArea } = useStatisticsContext();
  const { selectedPolygonIndexes } = useSolutionContext();

  if (isNaN(unionArea)) return null;

  return (
    <OverlayTrigger
      placement="auto"
      overlay={<Tooltip>Area of the union of the selected polygons.</Tooltip>}
    >
      <li>
        <span className="fa-li">
          <UnionAreaIcon selectedPolygonIndexes={selectedPolygonIndexes} />
        </span>
        {Math.floor(unionArea).toLocaleString()} m<sup>2</sup>
      </li>
    </OverlayTrigger>
  );
};

export default AreaUnion;
