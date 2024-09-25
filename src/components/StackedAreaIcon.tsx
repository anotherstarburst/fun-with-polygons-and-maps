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
                    key={`${polygonColorOptions[value]}-icon`}
                    style={{
                        color: polygonColorOptions[value],
                        fontSize: '1em',
                        paddingRight: '2px',
                    }}
                />
            ))}
        </>
    );
}
