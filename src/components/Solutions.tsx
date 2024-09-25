import React from 'react';
import { useSolutionContext } from '../context/SolutionContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Solutions: React.FC = () => {
  const {
    selectedSolutionIndex,
    setSelectedSolutionIndex,
  } = useSolutionContext();

  const handleSolutionChange = (solutionIndex: number) => {
    setSelectedSolutionIndex(solutionIndex);
  };

  return (
    <div className="d-flex flex-column h-100 justify-content-between">
      <div>
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
      </div>
      <a
        className="text-center text-secondary fs-4 m-3"
        href="https://github.com/anotherstarburst/fun-with-polygons-and-maps"
        target="_blank"
      >
        <FontAwesomeIcon icon={faGithub} />
      </a>
    </div>
  );
};

export default Solutions;
