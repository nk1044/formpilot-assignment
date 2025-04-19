import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';


const router = createBrowserRouter([{
  path: '/',
  element: <Layout />,
  children: [
    {path: '', element: <Home />},
    {path: 'dashboard', element: <Dashboard />},
  ]

}]);


const App: React.FC = () => {

  return (
    <RouterProvider router={router}  />
  );
};

export default App;

