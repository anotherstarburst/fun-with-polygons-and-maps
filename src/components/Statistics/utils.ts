import * as turf from '@turf/turf';
import { Geometry } from '../../types';

export const calculateArea = (polygon: Geometry) => {
  const p = turf.polygon(polygon.coordinates);
  return turf.area(p);
};
