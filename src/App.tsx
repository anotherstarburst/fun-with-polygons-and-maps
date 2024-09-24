function App() {
  return (
    <div className="container">
      <div className="row">
        <div
          className="col"
          style={{
            width: '200px',
          }}
        >
          List of proposed solutions
        </div>
        <div className="col">Work surface for a selected solution</div>
        <div
          className="col"
          style={{
            width: '200px',
          }}
        >
          Statistics
          <br />
          Tools available for selected solution
        </div>
      </div>
    </div>
  );
}

export default App;
