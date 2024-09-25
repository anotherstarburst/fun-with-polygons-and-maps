import React from 'react';
import { useSolutionContext } from './SolutionContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

const Solutions: React.FC = () => {
  const {
    selectedSolutionIndex,
    setSelectedSolutionIndex,
    setSelectedPolygonIndexes,
  } = useSolutionContext();

  const handleSolutionChange = (solutionIndex: number) => {
    // Clear the selected polygon indexes to avoid race conditions.
    setSelectedPolygonIndexes([]);
    setSelectedSolutionIndex(solutionIndex);
  };

  return (
    <>
      <p className="text-secondary fs-4 m-3">
        <FontAwesomeIcon icon={faLayerGroup} className="me-1" />
        Solutions
      </p>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <input
            className="form-check-input me-2"
            type="radio"
            name="listGroupRadio"
            id="firstRadio"
            checked={selectedSolutionIndex === 0}
            onChange={() => handleSolutionChange(0)}
          />
          <label className="form-check-label" htmlFor="firstRadio">
            Solution 1
          </label>
        </li>
        <li className="list-group-item">
          <input
            className="form-check-input me-2"
            type="radio"
            name="listGroupRadio"
            id="secondRadio"
            checked={selectedSolutionIndex === 1}
            onChange={() => handleSolutionChange(1)}
          />
          <label className="form-check-label" htmlFor="secondRadio">
            Solution 2
          </label>
        </li>
      </ul>
    </>
  );
};

export default Solutions;
