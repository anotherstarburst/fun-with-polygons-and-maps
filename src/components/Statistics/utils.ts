import * as turf from '@turf/turf';
import { Geometry } from 'geojson';
export const calculateArea = (polygon: Geometry) => {
  if (!polygon || polygon.type !== 'Polygon') {
    throw new Error('Invalid polygon');
  }
  const p = turf.polygon(polygon.coordinates);
  return turf.area(p);
};
