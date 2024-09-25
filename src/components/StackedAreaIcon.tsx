import { polygonColorOptions } from './constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

interface StackedAreaIconProps {
  selectedPolygonIndexes: number[];
}

export default function StackedAreaIcon(props: StackedAreaIconProps) {
  const { selectedPolygonIndexes } = props;
  return (
    <>
      {selectedPolygonIndexes.map((value) => (
        <FontAwesomeIcon
          icon={faSquare}
          style={{
            color: polygonColorOptions[value],
            fontSize: '1em',
            marginRight: '1px',
          }}
        />
      ))}
    </>
  );
}
