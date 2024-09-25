import { useState, useMemo, ReactNode, useEffect } from 'react';
import { SolutionContext } from './components/SolutionContext';
import { FeatureCollection } from './types';

import responseOne from './api-responses/SE_State_Management_Polygons_1.json';
import responseTwo from './api-responses/SE_State_Management_Polygons_2.json';

interface SolutionProviderProps {
  children: ReactNode;
}

export function SolutionProvider({ children }: SolutionProviderProps) {
  const apiResponse = useMemo(() => {
    return [responseOne, responseTwo] as FeatureCollection[];
  }, []);

  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState<number>(0);
  const [selectedPolygonIndexes, setSelectedPolygonIndexes] = useState<number[]>([]);
  const [solutions, setSolutions] = useState<FeatureCollection[]>(apiResponse);

  const activeSolution = useMemo(() => {
    return solutions[selectedSolutionIndex];
  }, [solutions, selectedSolutionIndex]);

  // Reset the selected polygons when the solution changes
  useEffect(() => {
    setSelectedPolygonIndexes([]);
  }, [selectedSolutionIndex]);

  useEffect(() => {
    setSelectedPolygonIndexes([]);
    console.log({ selectedSolutionIndex }, solutions.length - 1)
    if (selectedSolutionIndex > solutions.length - 1) {
      setSelectedSolutionIndex(solutions.length - 1);
    }
  }, [selectedSolutionIndex, solutions]);

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
