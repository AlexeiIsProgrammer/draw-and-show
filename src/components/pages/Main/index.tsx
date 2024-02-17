import React from 'react';
import { Burger, Center } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import Tools from '@/components/Tools';
import DrawCanvas from '@/components/DrawCanvas';

import styles from './Main.module.scss';

function Main() {
  const [opened, { close, toggle }] = useDisclosure(false);

  return (
    <div>
      <Tools opened={opened} close={close} />
      <Center>
        <Burger color="blue" className={styles.burger} opened={opened} onClick={toggle} />

        <DrawCanvas />
      </Center>
    </div>
  );
}

export default Main;
