import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSolutionContext } from '../../../context/SolutionContext';
import { polygonColorOptions } from '../../constants';
import { calculateArea } from '../utils';

const IndividualArea = (props: { polygonIndex: number }) => {
  const { polygonIndex } = props;
  const { activeSolution } = useSolutionContext();

  return (
    <OverlayTrigger
      placement="auto"
      overlay={
        <Tooltip>
          Area of the {polygonColorOptions[polygonIndex]} polygon
        </Tooltip>
      }
    >
      <li>
        <span className="fa-li">
          <FontAwesomeIcon
            icon={faSquare}
            style={{
              color: polygonColorOptions[polygonIndex],
            }}
          />
        </span>
        <span
          title={`${calculateArea(activeSolution.features[polygonIndex].geometry)}`}
        >
          {Math.floor(
            calculateArea(activeSolution.features[polygonIndex].geometry)
          ).toLocaleString()}{' '}
          m<sup>2</sup>
        </span>
      </li>
    </OverlayTrigger>
  );
};
export default IndividualArea;
