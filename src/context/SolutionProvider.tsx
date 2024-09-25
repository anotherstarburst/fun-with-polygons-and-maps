import { ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import { FeatureCollection } from '../types';
import { SolutionContext } from './SolutionContext';

import responseOne from '../data/SE_State_Management_Polygons_1.json';
import responseTwo from '../data/SE_State_Management_Polygons_2.json';

interface SolutionProviderProps {
  children: ReactNode;
}

export function SolutionProvider({ children }: SolutionProviderProps) {
  const apiResponse = useMemo(() => {
    return [responseOne, responseTwo] as FeatureCollection[];
  }, []);

  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState<number>(0);
  const [selectedPolygonIndexes, setSelectedPolygonIndexes] = useState<
    number[]
  >([]);
  const [solutions, setAllSolutions] =
    useState<FeatureCollection[]>(apiResponse);

  const activeSolution = useMemo(() => {
    return solutions[selectedSolutionIndex];
  }, [solutions, selectedSolutionIndex]);

  // Reset the selected polygons when the solution changes
  useEffect(() => {
    setSelectedPolygonIndexes([]);
  }, [selectedSolutionIndex]);

  // We're using a callback here, instead of a direct setState call to handle side effects
  // (e.g. resetting the selected polygon indexes). Otherwise the app crashes if you set a set of solutions
  // that are smaller than the previous solution
  const setSolutions = useCallback(
    (newSolutions: FeatureCollection[]) => {
      setSelectedPolygonIndexes([]);
      if (selectedSolutionIndex > solutions.length - 1) {
        setSelectedSolutionIndex(solutions.length - 1);
      }
      setAllSolutions(newSolutions);
    },
    [selectedSolutionIndex, solutions.length]
  );

  return (
    <SolutionContext.Provider
      value={{
        selectedSolutionIndex,
        setSelectedSolutionIndex,
        activeSolution,
        solutions,
        setSolutions,
        selectedPolygonIndexes,
        setSelectedPolygonIndexes,
      }}
    >
      {children}
    </SolutionContext.Provider>
  );
}
