import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './components/Auth';


const router = createBrowserRouter([{
  path: '/',
  element: <Layout />,
  children: [
    {path: '', element: <Home />},
    {path: 'dashboard', element: <Auth><Dashboard /></Auth>},
  ]

}]);


const App: React.FC = () => {

  return (
    <RouterProvider router={router}  />
  );
};

export default App;

