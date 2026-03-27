import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const Bandeja = () => <div style={{padding: '20px'}}><h1>Bandeja de Entrada</h1></div> 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>        
          <Route path='/inbox' element={<Bandeja/>}/>
        </Route>
        
        
      </Routes>
    </Router>
  )
}



export default App;