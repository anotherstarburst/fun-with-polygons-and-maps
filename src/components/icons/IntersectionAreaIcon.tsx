import { faSquare } from '@fortawesome/free-regular-svg-icons';

import { polygonColorOptions } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IntersectionAreaIconProps {
  selectedPolygonIndexes: number[];
}

export default function IntersectionAreaIcon(props: IntersectionAreaIconProps) {
  const { selectedPolygonIndexes } = props;
  return (
    <span className="fa-layers fa-fw me-2">
      {selectedPolygonIndexes.map((value, index) => {
        const shift = index * (60 / selectedPolygonIndexes.length);
        return (
          <FontAwesomeIcon
            key={value}
            icon={faSquare}
            style={{
              color: polygonColorOptions[value],
              marginLeft: `${shift}%`,
            }}
          />
        );
      })}
    </span>
  );
}
