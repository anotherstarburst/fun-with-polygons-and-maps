import { useSolutionContext } from '../../../context/SolutionContext';

import IntersectionAreaIcon from '../../icons/IntersectionAreaIcon';
import UnionAreaIcon from '../../icons/UnionAreaIcon';
import * as turf from '@turf/turf';
import { usePolygonOperations } from '../../../hooks/usePolygonOperations';
import { useStatisticsContext } from '../../../context/StatisticsContext';
import Button from './Button';

function Tools() {
  const { selectedPolygonIndexes, solutions } = useSolutionContext();

  const { turfPolygons } = useStatisticsContext();

  const { updatePolygonsArray } = usePolygonOperations();

  if (selectedPolygonIndexes.length < 2) return null;

  const handleUnion = () => {
    const union = turf.union(turf.featureCollection(turfPolygons));
    updatePolygonsArray(union, solutions);
  };

  const handleIntersection = () => {
    const intersection = turf.intersect(turf.featureCollection(turfPolygons));
    updatePolygonsArray(intersection, solutions);
  };

  return (
    <>
      <Button
        label="Union"
        onClick={handleUnion}
        IconComponent={UnionAreaIcon}
      />
      <Button
        label="Intersection"
        onClick={handleIntersection}
        IconComponent={IntersectionAreaIcon}
      />
    </>
  );
}

export default Tools;
