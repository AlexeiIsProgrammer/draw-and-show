import { Burger, Center, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { useDisclosure } from '@mantine/hooks';
import Tools from '../Tools';
import { theme } from '../../theme';
import styles from './App.module.scss';
import DrawCanvas from '../DrawCanvas';

export default function App() {
  const [opened, { close, toggle }] = useDisclosure(false);

  return (
    <MantineProvider theme={theme}>
      <Center>
        <Tools opened={opened} close={close} />
        <Burger
          color={opened ? 'blue' : 'dark'}
          className={styles.burger}
          opened={opened}
          onClick={toggle}
        />

        <DrawCanvas />
      </Center>
    </MantineProvider>
  );
}
