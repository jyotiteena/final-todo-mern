import {HashRouter, Routes,Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MockApi from './MockApi';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MockApi/>} />
      </Routes>
    </HashRouter>
  )
}

export default App