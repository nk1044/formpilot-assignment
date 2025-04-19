// import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from './pages/Home';
import Task from "./components/Task";
import NewTask from "./components/NewTask";

const router = createBrowserRouter([{
  path: "/",
  element: <Layout />,
  children: [
    {path: "", element: <Home />},
    {path: "task/:txHash", element: <Task />},
    {path: "new-task", element: <NewTask />},
  ]
}]);

function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
