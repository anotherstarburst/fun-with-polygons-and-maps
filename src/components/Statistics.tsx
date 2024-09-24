import { useSolutionContext } from './SolutionContext';
import { useMemo } from 'react';
import { polygonColorOptions } from './utils';

function Statistics() {
  const { selectedPolygons } = useSolutionContext();
  const area = useMemo(() => {
    return 1000;
  }, []);

  return (
    <>
      <h3>Statistics</h3>
      {selectedPolygons.length > 0 && (
        <>
          <p>Polgons selected</p>
          <ol>
            {selectedPolygons.map((value) => {
              return (
                <li
                  className=""
                  style={{
                    color: polygonColorOptions[value],
                  }}
                >
                  {polygonColorOptions[value]}
                </li>
              );
            })}
          </ol>
        </>
      )}
      <p>
        Area: {area}m <mark>Todo - requires union to be calculated first</mark>
      </p>
      <hr />
      <h3>Tools</h3>
      <hr />
      Tools available for selected solution
    </>
  );
}

export default Statistics;
