import { useCallback } from 'react';
import {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from 'geojson';
import * as turf from '@turf/turf';
import { useSolutionContext } from '../context/SolutionContext';

export const usePolygonOperations = () => {
  const { selectedPolygonIndexes, selectedSolutionIndex, setSolutions } =
    useSolutionContext();

  const updatePolygonsArray = useCallback(
    (
      newPolygon: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null,
      solutions: FeatureCollection[]
    ) => {
      if (!newPolygon) {
        console.error('No polygon');
        return solutions;
      }

      const newSolutions = [...solutions];

      // Remove the selected polygons
      const newFeatures = newSolutions[selectedSolutionIndex].features.filter(
        (_, index) => !selectedPolygonIndexes.includes(index)
      );

      const addPolygonFeature = (polygonGeometry: Polygon) => {
        newFeatures.push({
          type: 'Feature',
          properties: {},
          geometry: polygonGeometry,
        });
      };

      if (newPolygon.geometry.type === 'Polygon') {
        addPolygonFeature(newPolygon.geometry);
      } else if (newPolygon.geometry.type === 'MultiPolygon') {
        newPolygon.geometry.coordinates.forEach((polygonCoords) => {
          addPolygonFeature({
            type: 'Polygon',
            coordinates: polygonCoords,
          });
        });
      } else {
        throw new Error('Invalid geometry type');
      }

      // Sort the features to ensure no polygon fully contains another that precedes it
      newFeatures.sort((a, b) => {
        if (turf.booleanContains(a, b)) return -1;
        if (turf.booleanContains(b, a)) return 1;
        return 0;
      });

      newSolutions[selectedSolutionIndex] = {
        ...newSolutions[selectedSolutionIndex],
        features: newFeatures,
      };

      setSolutions(newSolutions);
    },
    [selectedPolygonIndexes, selectedSolutionIndex, setSolutions]
  );

  return { updatePolygonsArray };
};
