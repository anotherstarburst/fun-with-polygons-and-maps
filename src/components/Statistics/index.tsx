import Statistics from './Statistics';
import { StatisticsProvider } from '../../context/StatisticsContext';

function StatisticsWrapper() {
  return (
    <StatisticsProvider>
      <Statistics />
    </StatisticsProvider>
  );
}

export default StatisticsWrapper;
