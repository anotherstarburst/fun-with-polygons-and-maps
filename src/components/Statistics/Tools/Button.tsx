import React from 'react';
import { useSolutionContext } from '../../../context/SolutionContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { useStatisticsContext } from '../../../context/StatisticsContext';

interface ButtonProps {
  label: string;
  onClick: () => void;
  IconComponent: React.ComponentType<{ selectedPolygonIndexes: number[] }>;
}

const Button = (props: ButtonProps): JSX.Element => {
  const { onClick, label, IconComponent } = props;
  const { selectedPolygonIndexes } = useSolutionContext();

  const { arePolygonsOverlapping, arePolygonsContained } =
    useStatisticsContext();

  const isBtnDisabled = !(arePolygonsOverlapping || arePolygonsContained);
  return (
    <button
      className="btn btn-outline-light w-100 mb-2"
      onClick={onClick}
      disabled={isBtnDisabled}
    >
      {isBtnDisabled ? (
        <FontAwesomeIcon className="me-1" icon={faBan} />
      ) : (
        <IconComponent selectedPolygonIndexes={selectedPolygonIndexes} />
      )}
      {label}
    </button>
  );
};

export default Button;
