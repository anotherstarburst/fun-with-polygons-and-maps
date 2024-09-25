import { polygonColorOptions } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

interface UnionAreaIconsProps {
  selectedPolygonIndexes: number[];
}

export default function UnionAreaIcons(props: UnionAreaIconsProps) {
  const { selectedPolygonIndexes } = props;
  return (
    <span className="fa-layers fa-fw me-2">
      {selectedPolygonIndexes.map((value, index) => {
        const shift = index * (100 / selectedPolygonIndexes.length);
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
