import './App.css';
import {Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage';
import { SocketProvider } from './providers/Socket';
function App() {
  return (
    <div className="App">
      <SocketProvider>
        <Routes>
          <Route path = '/' element={<HomePage/>}/>
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
