import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import './index.css';
import App from './App';
import HomePage from './pages/Home/HomePage';
import Test, { loader as testLoader } from './components/Test';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import EditorPage from './pages/Editor/EditorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'test',
        element: <Test />,
        loader: testLoader,
      },
      {
        path: 'editor',
        element: <EditorPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

const container = document.getElementById('root');

if (container != null) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
} else {
  console.error("No element with id 'root' found");
}
