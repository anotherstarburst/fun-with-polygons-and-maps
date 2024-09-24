import { useSolutionContext } from './SolutionContext';

function Solutions() {
  const { selectedSolution, setSelectedSolution } = useSolutionContext();
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
            checked={selectedSolution === 1}
            onClick={() => setSelectedSolution(1)}
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
            checked={selectedSolution === 2}
            onClick={() => setSelectedSolution(2)}
          />
          <label className="form-check-label" htmlFor="secondRadio">
            Solution 2
          </label>
        </li>
      </ul>
    </>
  );
}

export default Solutions;
