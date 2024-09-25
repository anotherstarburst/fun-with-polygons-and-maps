import { useSolutionContext } from './SolutionContext';
import { useCallback, useMemo } from 'react';
import { polygonColorOptions } from './constants';
import { Geometry } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPizzaSlice, faSquare } from '@fortawesome/free-solid-svg-icons';
import styles from './Statistics.module.scss';
import * as turf from '@turf/turf';

function Statistics() {
  const {
    selectedPolygonIndexes,
    activeSolution,
    selectedSolutionIndex,
    setSolutions,
    setSelectedPolygonIndexes,
  } = useSolutionContext();

  const computedArea = useCallback((polygon: Geometry) => {
    const p = turf.polygon(polygon.coordinates);
    return turf.area(p);
  }, []);

  const stackedArea = useMemo(() => {
    let area = 0;
    // Adds the areas of all selected polygons together.
    console.log({ selectedPolygonIndexes });
    for (const index of selectedPolygonIndexes) {
      area += computedArea(activeSolution.features[index].geometry);
    }
    return area;
  }, [activeSolution, computedArea, selectedPolygonIndexes]);

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
          <div className="mt-1">
            <button
              className="btn btn-outline-light w-100 mb-1"
              onClick={() => {
                // This will calculate the union of the selected polygons. It will then
                // replace the polygons that were united, with the union.
                // setSolutions will be used to update the solutions. Note selectedSolutionIndex corresponds
                // to the activeSolution within the solutions array.
                const union = turf.union(turf.featureCollection(turfPolygons));

                // We get a race condition otherwise, so we need to clone the array
                // and reset the selected polygons to an empty array
                const selectedPolygonIndexesClone = [...selectedPolygonIndexes];
                setSelectedPolygonIndexes([]);

                setSolutions((prevSolutions) => {
                  if (!union) return prevSolutions;

                  if (union.geometry.type !== 'Polygon') return prevSolutions;

                  const newSolutions = [...prevSolutions];
                  const newFeatures = [
                    ...newSolutions[selectedSolutionIndex].features,
                  ];

                  // Remove the original polygons
                  const updatedFeatures = newFeatures.filter(
                    (_, index) => !selectedPolygonIndexesClone.includes(index)
                  );

                  // Add the union polygon
                  updatedFeatures.push({
                    type: 'Feature',
                    properties: {},
                    geometry: union.geometry,
                  });

                  newSolutions[selectedSolutionIndex] = {
                    ...newSolutions[selectedSolutionIndex],
                    features: updatedFeatures,
                  };

                  return newSolutions;
                });
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

                // We get a race condition otherwise, so we need to clone the array
                // and reset the selected polygons to an empty array
                const selectedPolygonIndexesClone = [...selectedPolygonIndexes];
                setSelectedPolygonIndexes([]);

                setSolutions((prevSolutions) => {
                  if (!intersection) return prevSolutions;

                  if (intersection.geometry.type !== 'Polygon')
                    return prevSolutions;

                  const newSolutions = [...prevSolutions];
                  const newFeatures = [
                    ...newSolutions[selectedSolutionIndex].features,
                  ];

                  // Remove the original polygons
                  const updatedFeatures = newFeatures.filter(
                    (_, index) => !selectedPolygonIndexesClone.includes(index)
                  );

                  // Add the union polygon
                  updatedFeatures.push({
                    type: 'Feature',
                    properties: {},
                    geometry: intersection.geometry,
                  });

                  newSolutions[selectedSolutionIndex] = {
                    ...newSolutions[selectedSolutionIndex],
                    features: updatedFeatures,
                  };

                  return newSolutions;
                });
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
          <p className="text-secondary fs-6">Selected Area</p>
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
                    title={`${computedArea(activeSolution.features[value].geometry)}`}
                  >
                    {Math.floor(
                      computedArea(activeSolution.features[value].geometry)
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
}

export default Statistics;
