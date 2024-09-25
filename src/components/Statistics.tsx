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
import styles from './Statistics.module.scss';
import * as turf from '@turf/turf';
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';

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

  if (!selectedPolygonIndexes.length)
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
                // This will calculate the union of the selected polygons. It will then
                // replace the polygons that were united, with the union.
                // setSolutions will be used to update the solutions. Note selectedSolutionIndex corresponds
                // to the activeSolution within the solutions array.
                const union = turf.union(turf.featureCollection(turfPolygons));

                updatePolygonsArray(union);
              }}
            >
              <div
                className={`${styles['custom-icon-stack']} ${styles[`total-icons-${selectedPolygonIndexes.length}`]}`}
              >
                {selectedPolygonIndexes.map((value, index) => (
                  <span key={index} className={`${styles['fa-stack']}`}>
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={`${styles['stacked-icon']}`}
                      style={{ color: polygonColorOptions[value] }}
                    />
                  </span>
                ))}
              </div>
              Union
            </button>
            <button
              className="btn btn-outline-light w-100"
              onClick={() => {
                // TODO: this will calculate the intersection of the selected polygons. It will then
                // replace the polygons that were intersected, with the intersection.
                // setSolutions will be used to update the solutions. Note selectedSolutionIndex corresponds
                // to the activeSolution within the solutions array.
                const intersection = turf.intersect(
                  turf.featureCollection(turfPolygons)
                );

                updatePolygonsArray(intersection);
              }}
            >
              <FontAwesomeIcon icon={faPizzaSlice} className="me-1" />
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
          <ul className="fa-ul ms-4 text-end font-monospace">
            {selectedPolygonIndexes.map((value) => {
              return (
                <li>
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
              <>
                <li>
                  <span className="fa-li">
                    {selectedPolygonIndexes.map((value) => (
                      <FontAwesomeIcon
                        icon={faSquare}
                        style={{
                          color: polygonColorOptions[value],
                          fontSize: '1em',
                          marginRight: '1px',
                        }}
                      />
                    ))}
                  </span>
                  {Math.floor(stackedArea).toLocaleString()} m<sup>2</sup>
                </li>
              </>
            )}
            {!isNaN(unionArea) && (
              <>
                <li>
                  <span className="fa-li">
                    <div
                      className={`${styles['custom-icon-stack']} ${styles[`total-icons-${selectedPolygonIndexes.length}`]}`}
                    >
                      {selectedPolygonIndexes.map((value, index) => (
                        <span key={index} className={`${styles['fa-stack']}`}>
                          <FontAwesomeIcon
                            icon={faSquare}
                            className={`${styles['stacked-icon']}`}
                            style={{ color: polygonColorOptions[value] }}
                          />
                        </span>
                      ))}
                    </div>
                  </span>
                  {Math.floor(unionArea).toLocaleString()} m<sup>2</sup>
                </li>
              </>
            )}
            {!isNaN(intersectionArea) && (
              <>
                <li title="Intersection area">
                  <span className="fa-li">
                    <FontAwesomeIcon icon={faPizzaSlice} />
                  </span>
                  {Math.floor(intersectionArea).toLocaleString()} m<sup>2</sup>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );

  function updatePolygonsArray(
    newPolygon: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null
  ) {
    // We need to reset the selected polygons to an empty array before we update
    // the polygons array otherwise a race condition will occur as solutions
    // updates, triggering hooks, before the selected polygons array is updated.
    const selectedPolygonIndexesClone = [...selectedPolygonIndexes];
    setSelectedPolygonIndexes([]);

    setSolutions((prevSolutions) => {
      if (!newPolygon) {
        console.error('No polygon');
        return prevSolutions;
      }

      if (newPolygon.geometry.type !== 'Polygon') {
        console.log("Not a polygon, it's a: " + newPolygon.geometry.type);
        return prevSolutions;
      }

      const newSolutions = [...prevSolutions];
      const newFeatures = [...newSolutions[selectedSolutionIndex].features];

      // Remove the original polygons
      const updatedFeatures = newFeatures.filter(
        (_, index) => !selectedPolygonIndexesClone.includes(index)
      );

      // Add the union polygon
      updatedFeatures.push({
        type: 'Feature',
        properties: {},
        geometry: newPolygon.geometry,
      });

      newSolutions[selectedSolutionIndex] = {
        ...newSolutions[selectedSolutionIndex],
        features: updatedFeatures,
      };

      return newSolutions;
    });
  }
}

export default Statistics;
