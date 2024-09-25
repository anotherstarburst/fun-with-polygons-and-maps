import { useSolutionContext } from '../../context/SolutionContext';
import { useMemo } from 'react';

import * as turf from '@turf/turf';
import { calculateArea } from './utils';
import Area from './Area/Area';
import Tools from './Tools';

function Statistics() {
  const { selectedPolygonIndexes, activeSolution } = useSolutionContext();

  const stackedArea = useMemo(() => {
    let area = 0;
    // Add the areas of all selected polygons together.
    selectedPolygonIndexes.forEach((polygonIndex) => {
      area += calculateArea(activeSolution.features[polygonIndex].geometry);
    });
    return area;
  }, [activeSolution, selectedPolygonIndexes]);

  const turfPolygons = useMemo(() => {
    if (!activeSolution) return [];

    if (selectedPolygonIndexes.length > 2)
      throw new Error('Too many polygons selected');

    const polygons = [];
    for (const polygonIndex of selectedPolygonIndexes) {
      const { coordinates } = activeSolution.features[polygonIndex].geometry;
      polygons.push(turf.polygon(coordinates));
    }
    return polygons;
  }, [selectedPolygonIndexes, activeSolution]);

  const arePolygonsOverlapping = useMemo(() => {
    // Impossible to have overlapping polygons if there is only one polygon
    if (turfPolygons.length < 2) return false;

    // returns true if the two geometries overlap, provided that neither completely contains the other.
    return turf.booleanOverlap(turfPolygons[0], turfPolygons[1]);
  }, [turfPolygons]);

  const arePolygonsContained = useMemo(() => {
    // Impossible to have overlapping polygons if there is only one polygon
    if (turfPolygons.length < 2) return false;

    // returns true if either geometry completely contains the other.
    return (
      turf.booleanContains(turfPolygons[0], turfPolygons[1]) ||
      turf.booleanContains(turfPolygons[1], turfPolygons[0])
    );
  }, [turfPolygons]);

  const unionArea = useMemo(() => {
    // Only calculated if there are two or more selected polygons and all overlap
    // or are contained
    if (!arePolygonsOverlapping && !arePolygonsContained) return NaN;

    const union = turf.union(turf.featureCollection(turfPolygons));

    if (!union) return NaN;

    return turf.area(union);
  }, [arePolygonsContained, arePolygonsOverlapping, turfPolygons]);

  const intersectionArea = useMemo(() => {
    // Only calculated if there are two or more selected polygons and all overlap
    // or are contained
    if (!arePolygonsOverlapping && !arePolygonsContained) return NaN;

    const intersection = turf.intersect(turf.featureCollection(turfPolygons));

    if (!intersection) return NaN;

    return turf.area(intersection);
  }, [arePolygonsContained, arePolygonsOverlapping, turfPolygons]);

  if (selectedPolygonIndexes.length < 1)
    return (
      <div className="d-flex flex-column h-100 justify-content-center align-items-center">
        <p>Please select a polygon to start.</p>
      </div>
    );

  return (
    <div className="d-flex flex-column h-100 justify-content-between">
      <Area
        unionArea={unionArea}
        intersectionArea={intersectionArea}
        stackedArea={stackedArea}
      />

      <Tools
        arePolygonsOverlapping={arePolygonsOverlapping}
        arePolygonsContained={arePolygonsContained}
        turfPolygons={turfPolygons}
      />
    </div>
  );
}

export default Statistics;
