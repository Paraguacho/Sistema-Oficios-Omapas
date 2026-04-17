import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Inbox from './pages/Inbox';
import Sent from './pages/Sent';
import Starred from './pages/Starred';
import Archived from './pages/Archived';
import Signed from './pages/Signed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        
        <Route element={<ProtectedRoute />}>  
          <Route element={<MainLayout/>}>     
            <Route path='/' element={<Navigate to = "/inbox" replace />}/>
            <Route path='/inbox' element={<Inbox/>}/>
            <Route path='/sent' element={<Sent/>}/>
            <Route path='/starred' element={<Starred/>}/>
            <Route path='/archived' element={<Archived/>}/>
            <Route path='/signed' element={<Signed/>}/>
         </Route>
        </Route>
        
        
      </Routes>
    </Router>
  )
}



export default App;