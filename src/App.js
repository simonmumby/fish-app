import logo from './logo.svg';
import fish from './fish.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={fish} className="App-logo" alt="logo" />
        <p>
          Lost of fishes coming soon...
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          My Fish App!
        </a>
      </header>
    </div>
  );
}

export default App;