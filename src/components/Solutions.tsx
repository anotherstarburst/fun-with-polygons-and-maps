import React from 'react';
import { useSolutionContext } from './SolutionContext';

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
      <h3>Solutions</h3>
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
