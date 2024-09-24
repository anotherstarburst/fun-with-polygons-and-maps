import { useMemo, useState } from "react";

import responseOne from './api-responses/SE_State_Management_Polygons_1.json'
import responseTwo from './api-responses/SE_State_Management_Polygons_2.json'

function App() {
  const [selectedSolution, setSelectedSolution] = useState<number>(1);

  const payload = useMemo(() => {
    if (selectedSolution === 1) return responseOne;
    return responseTwo;
  }, [selectedSolution]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col"
          style={{
            maxWidth: '200px',
          }}
        >
          <h3>Solutions</h3>

          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <input className="form-check-input me-2" type="radio" name="listGroupRadio" value="" id="firstRadio" checked={selectedSolution === 1}
                onClick={() => {
                  setSelectedSolution(1);
                }}
              />
              <label className="form-check-label" htmlFor="firstRadio">Solution 1</label>
            </li>
            <li className="list-group-item">
              <input className="form-check-input me-2" type="radio" name="listGroupRadio" value="" id="secondRadio" checked={selectedSolution === 2}
                onClick={() => {
                  setSelectedSolution(2);
                }}
              />
              <label className="form-check-label" htmlFor="secondRadio">Solution 2</label>
            </li>
          </ul>
        </div>
        <div className="col"><p>Work surface for a selected solution</p>
          {JSON.stringify(payload)}
        </div>
        <div
          className="col"
          style={{
            maxWidth: '200px',
          }}
        >
          <h3>Statistics</h3>
          <hr />
          <h3>Tools</h3>
          <hr />
          Tools available for selected solution
        </div>
      </div >
    </div >
  );
}

export default App;
