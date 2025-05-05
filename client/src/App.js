import './App.css';
import {Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage';
import { SocketProvider } from './providers/Socket';
import { PeerProvider } from './providers/Peer';
import RoomPage from './pages/Room';
function App() {
  return (
    <div className="App">
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path = "/" element = {<HomePage/>}/>
            <Route path = "/room/:roomId" element = {<RoomPage/>}/>
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
