import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import List from './pages/List/List';
import AddEdit from './pages/AddEdit/AddEdit';
import PrivateRoute from './pages/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/list"
          element={
            <PrivateRoute>
              <List />
            </PrivateRoute>
          }
        />
        <Route
          path="/form"
          element={
            <PrivateRoute>
              <AddEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="/form/:id"
          element={
            <PrivateRoute>
              <AddEdit />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
