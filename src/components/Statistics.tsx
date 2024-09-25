import { useSolutionContext } from './SolutionContext';
import { useCallback, useMemo } from 'react';
import { polygonColorOptions } from './constants';
import { Geometry } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPizzaSlice,
  faRuler,
  faSquare,
  faToolbox,
} from '@fortawesome/free-solid-svg-icons';

import * as turf from '@turf/turf';
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import UnionAreaIcon from './UnionAreaIcon';
import StackedAreaIcon from './StackedAreaIcon';
import IntersectionAreaIcon from './IntersectionAreaIcon';

function Statistics() {
  const {
    selectedPolygonIndexes,
    activeSolution,
    selectedSolutionIndex,
    setSolutions,
    setSelectedPolygonIndexes,
  } = useSolutionContext();

  const calculateArea = useCallback((polygon: Geometry) => {
    const p = turf.polygon(polygon.coordinates);
    return turf.area(p);
  }, []);

  const stackedArea = useMemo(() => {
    let area = 0;
    // Adds the areas of all selected polygons together.
    for (const index of selectedPolygonIndexes) {
      area += calculateArea(activeSolution.features[index].geometry);
    }
    return area;
  }, [activeSolution, calculateArea, selectedPolygonIndexes]);

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

    return turf.booleanOverlap(turfPolygons[0], turfPolygons[1]);
  }, [turfPolygons]);

  const unionArea = useMemo(() => {
    // Only calculated if there are two or more selected polygons and all overlap
    // otherwise we'll get MultiPolygons for union and we can't calculate the area
    if (!arePolygonsOverlapping) return NaN;

    const union = turf.union(turf.featureCollection(turfPolygons));

    if (!union) return NaN;

    return turf.area(union);
  }, [arePolygonsOverlapping, turfPolygons]);

  const intersectionArea = useMemo(() => {
    // Only calculated if there are two or more selected polygons and all overlap
    // otherwise we'll get MultiPolygons for intersection and we can't calculate the area
    if (!arePolygonsOverlapping) return NaN;

    const intersection = turf.intersect(turf.featureCollection(turfPolygons));

    if (!intersection) return NaN;

    return turf.area(intersection);
  }, [arePolygonsOverlapping, turfPolygons]);

  if (selectedPolygonIndexes.length < 1)
    return (
      <div className="d-flex flex-column h-100 justify-content-center align-items-center">
        <p>Please select a polygon to start.</p>
      </div>
    );

  return (
    // space between the two containers
    <div className="d-flex flex-column h-100 justify-content-between">
      <div>
        {arePolygonsOverlapping && (
          <div>
            <p className="text-secondary fs-4 mt-3">
              <FontAwesomeIcon icon={faToolbox} className="me-1" />
              Tools
            </p>
            <button
              className="btn btn-outline-light w-100 mb-2"
              onClick={() => {
                const union = turf.union(turf.featureCollection(turfPolygons));
                updatePolygonsArray(union);
              }}
            >
              <UnionAreaIcon selectedPolygonIndexes={selectedPolygonIndexes} />
              Union
            </button>
            <button
              className="btn btn-outline-light w-100"
              onClick={() => {
                const intersection = turf.intersect(
                  turf.featureCollection(turfPolygons)
                );

                updatePolygonsArray(intersection);
              }}
            >
              <IntersectionAreaIcon
                selectedPolygonIndexes={selectedPolygonIndexes}
              />
              Intersection
            </button>
          </div>
        )}
      </div>

      {selectedPolygonIndexes.length > 0 && (
        <div>
          <p className="text-secondary fs-4">
            <FontAwesomeIcon icon={faRuler} className="me-1" />
            Area
          </p>

          {/* Right aligned, and monospaced so that it's easier to compare the numbers (spreadsheet style) */}
          <ul className="fa-ul ms-4 text-end font-monospace">
            {selectedPolygonIndexes.map((value) => {
              return (
                <li
                  title={`Individual area of ${polygonColorOptions[value]} polygon`}
                >
                  <span className="fa-li">
                    <FontAwesomeIcon
                      icon={faSquare}
                      style={{
                        color: polygonColorOptions[value],
                      }}
                    />
                  </span>
                  <span
                    title={`${calculateArea(activeSolution.features[value].geometry)}`}
                  >
                    {Math.floor(
                      calculateArea(activeSolution.features[value].geometry)
                    ).toLocaleString()}{' '}
                    m<sup>2</sup>
                  </span>
                </li>
              );
            })}

            {selectedPolygonIndexes.length > 1 && (
              <li title="Stacked area">
                <span className="fa-li">
                  <StackedAreaIcon
                    selectedPolygonIndexes={selectedPolygonIndexes}
                  />
                </span>
                {Math.floor(stackedArea).toLocaleString()} m<sup>2</sup>
              </li>
            )}

            {!isNaN(unionArea) && (
              <li title="Union area">
                <span className="fa-li">
                  <UnionAreaIcon
                    selectedPolygonIndexes={selectedPolygonIndexes}
                  />
                </span>
                {Math.floor(unionArea).toLocaleString()} m<sup>2</sup>
              </li>
            )}

            {!isNaN(intersectionArea) && (
              <li title="Intersection area">
                <span className="fa-li">
                  <IntersectionAreaIcon
                    selectedPolygonIndexes={selectedPolygonIndexes}
                  />
                </span>
                {Math.floor(intersectionArea).toLocaleString()} m<sup>2</sup>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );

  function updatePolygonsArray(
    newPolygon: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null
  ) {
    const selectedPolygonIndexesClone = [...selectedPolygonIndexes];
    setSelectedPolygonIndexes([]);

    setSolutions((prevSolutions) => {
      if (!newPolygon) {
        console.error('No polygon');
        return prevSolutions;
      }

      const newSolutions = [...prevSolutions];
      const newFeatures = [...newSolutions[selectedSolutionIndex].features];

      // Remove the original polygons
      const updatedFeatures = newFeatures.filter(
        (_, index) => !selectedPolygonIndexesClone.includes(index)
      );

      // Function to add a single polygon feature
      const addPolygonFeature = (polygonGeometry: Polygon) => {
        updatedFeatures.push({
          type: 'Feature',
          properties: {},
          geometry: polygonGeometry,
        });
      };

      // Handle Polygon or MultiPolygon
      if (newPolygon.geometry.type === 'Polygon') {
        addPolygonFeature(newPolygon.geometry);
      } else { // MultiPolygon
        newPolygon.geometry.coordinates.forEach((polygonCoords) => {
          addPolygonFeature({
            type: 'Polygon',
            coordinates: polygonCoords
          });
        });
      }

      newSolutions[selectedSolutionIndex] = {
        ...newSolutions[selectedSolutionIndex],
        features: updatedFeatures,
      };

      return newSolutions;
    });
  }
}

export default Statistics;
