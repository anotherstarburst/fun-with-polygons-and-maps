import { createContext, ReactNode, useContext, useMemo } from 'react';
import * as turf from '@turf/turf';
import { useSolutionContext } from './SolutionContext';
import { calculateArea } from '../components/Statistics/utils';
import { Feature, Polygon, GeoJsonProperties } from 'geojson';

interface StatisticsContextType {
  stackedArea: number;
  arePolygonsOverlapping: boolean;
  arePolygonsContained: boolean;
  unionArea: number;
  intersectionArea: number;
  turfPolygons: Feature<Polygon, GeoJsonProperties>[];
}

const defaultContextValue: StatisticsContextType = {
  stackedArea: 0,
  arePolygonsOverlapping: false,
  arePolygonsContained: false,
  unionArea: 0,
  intersectionArea: 0,
  turfPolygons: [],
};

const StatisticsContext =
  createContext<StatisticsContextType>(defaultContextValue);

export const useStatisticsContext = () => useContext(StatisticsContext);

interface StatisticsProviderProps {
  children: ReactNode;
}

export const StatisticsProvider = ({ children }: StatisticsProviderProps) => {
  const { selectedPolygonIndexes, activeSolution } = useSolutionContext();

  const stackedArea = useMemo(() => {
    let area = 0;
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
      const polygon = activeSolution.features[polygonIndex].geometry;

      if (!polygon || polygon.type !== 'Polygon') {
        throw new Error('Invalid polygon');
      }

      const { coordinates } = polygon;
      polygons.push(turf.polygon(coordinates));
    }
    return polygons;
  }, [selectedPolygonIndexes, activeSolution]);

  const arePolygonsOverlapping = useMemo(() => {
    if (turfPolygons.length < 2) return false;
    return turf.booleanOverlap(turfPolygons[0], turfPolygons[1]);
  }, [turfPolygons]);

  const arePolygonsContained = useMemo(() => {
    if (turfPolygons.length < 2) return false;
    return (
      turf.booleanContains(turfPolygons[0], turfPolygons[1]) ||
      turf.booleanContains(turfPolygons[1], turfPolygons[0])
    );
  }, [turfPolygons]);

  const unionArea = useMemo(() => {
    if (!arePolygonsOverlapping && !arePolygonsContained) return NaN;
    const union = turf.union(turf.featureCollection(turfPolygons));
    if (!union) return NaN;
    return turf.area(union);
  }, [arePolygonsContained, arePolygonsOverlapping, turfPolygons]);

  const intersectionArea = useMemo(() => {
    if (!arePolygonsOverlapping && !arePolygonsContained) return NaN;
    const intersection = turf.intersect(turf.featureCollection(turfPolygons));
    if (!intersection) return NaN;
    return turf.area(intersection);
  }, [arePolygonsContained, arePolygonsOverlapping, turfPolygons]);

  const value = {
    stackedArea,
    turfPolygons,
    arePolygonsOverlapping,
    arePolygonsContained,
    unionArea,
    intersectionArea,
  };

  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
};
