import { SolutionProvider } from './context/SolutionContext';
import Solutions from './components/Solutions';
import Statistics from './components/Statistics/Statistics';
import WorkSurface from './components/WorkSurface/WorkSurface';

function App() {
  return (
    <SolutionProvider>
      <div className="container-fluid">
        <div className="row">
          <div className="col" style={{ maxWidth: '200px' }}>
            <Solutions />
          </div>
          <div className="col">
            <WorkSurface />
          </div>
          <div className="col" style={{ maxWidth: '200px' }}>
            <Statistics />
          </div>
        </div>
      </div>
    </SolutionProvider>
  );
}

export default App;
