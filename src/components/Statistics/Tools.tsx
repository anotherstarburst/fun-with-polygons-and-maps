import React from 'react';
import { useSolutionContext } from '../../context/SolutionContext';

import IntersectionAreaIcon from '../icons/IntersectionAreaIcon';
import UnionAreaIcon from '../icons/UnionAreaIcon';
import * as turf from '@turf/turf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { usePolygonOperations } from '../../hooks/usePolygonOperations';
import { useStatisticsContext } from '../../context/StatisticsContext';

function Tools() {
  const { selectedPolygonIndexes, solutions } = useSolutionContext();

  const { arePolygonsOverlapping, arePolygonsContained, turfPolygons } =
    useStatisticsContext();

  const { updatePolygonsArray } = usePolygonOperations();

  const isBtnDisabled = !(arePolygonsOverlapping || arePolygonsContained);

  if (selectedPolygonIndexes.length < 2) return null;

  const handleUnion = () => {
    const union = turf.union(turf.featureCollection(turfPolygons));
    updatePolygonsArray(union, solutions);
  };

  const handleIntersection = () => {
    const intersection = turf.intersect(turf.featureCollection(turfPolygons));
    updatePolygonsArray(intersection, solutions);
  };

  const renderButton = (
    label: string,
    onClick: () => void,
    IconComponent: React.ComponentType<{ selectedPolygonIndexes: number[] }>
  ) => (
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

  return (
    <div>
      {renderButton('Union', handleUnion, UnionAreaIcon)}
      {renderButton('Intersection', handleIntersection, IntersectionAreaIcon)}
    </div>
  );
}

export default Tools;
