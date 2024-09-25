import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faSquare as faSquareSolid } from '@fortawesome/free-solid-svg-icons';
import { polygonColorOptions } from './constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IntersectionAreaIconProps {
    selectedPolygonIndexes: number[];
}

export default function IntersectionAreaIcon(props: IntersectionAreaIconProps) {
    const { selectedPolygonIndexes } = props;
    return (
        <span className="fa-layers fa-fw me-2">
            {selectedPolygonIndexes.map((value, index) => {
                const shift = index * (40 / selectedPolygonIndexes.length);
                return (
                    <FontAwesomeIcon
                        key={value}
                        icon={index > 0 ? faSquare : faSquare}
                        // fa-stack-2x
                        className={index > 0 ? 'fa-stack-1x' : ''}
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
