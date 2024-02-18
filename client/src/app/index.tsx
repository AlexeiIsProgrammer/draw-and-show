import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { store } from '@/redux';

import Main from '../components/pages/Main';
import Boards from '@/components/pages/Boards';

export default function App() {
  return (
    <MantineProvider defaultColorScheme="dark" withCssVariables>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/boards" element={<Boards />} />
            <Route path="/boards/:id" element={<Main />} />
            <Route path="/*" element={<Navigate to="/boards/:id" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </MantineProvider>
  );
}
