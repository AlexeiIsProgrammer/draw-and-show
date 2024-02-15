import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { store } from '@/redux';

import { theme } from '../../theme';
import Main from '../pages/Main';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Provider store={store}>
        <Main />
      </Provider>
    </MantineProvider>
  );
}
