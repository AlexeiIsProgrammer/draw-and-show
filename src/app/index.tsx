import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { store } from '@/redux';

import { theme } from '../theme';
import Main from '../components/pages/Main';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/:id" element={<Main />} />
            <Route path="/*" element={<Navigate to={(+new Date()).toString(16)} />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </MantineProvider>
  );
}
