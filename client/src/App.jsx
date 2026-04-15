import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Inbox from './pages/Inbox';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        
        <Route element={<ProtectedRoute />}>  
          <Route element={<MainLayout/>}>     
            <Route path='/' element={<Navigate to = "/inbox" replace />}/>
            <Route path='/inbox' element={<Inbox/>}/>
         </Route>
        </Route>
        
        
      </Routes>
    </Router>
  )
}



export default App;