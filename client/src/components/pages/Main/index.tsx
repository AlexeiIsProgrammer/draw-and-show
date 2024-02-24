import React, { useEffect } from 'react';
import { Burger, Center, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import Tools from '@/components/Tools';
import DrawCanvas from '@/components/DrawCanvas';

import styles from './Main.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux';
import { closeNotifyShowing, paintSelector } from '@/redux/slices/paintSlice';

function Main() {
  const [opened, { close, toggle }] = useDisclosure(false);

  const dispatch = useAppDispatch();
  const {
    isNotifyShowing: { isNotify, name },
  } = useAppSelector(paintSelector);

  useEffect(() => {
    if (isNotify) {
      setTimeout(() => {
        dispatch(closeNotifyShowing());
      }, 5000);
    }
  }, [isNotify]);

  return (
    <div>
      <Notification
        onClose={() => dispatch(closeNotifyShowing())}
        className={[styles.notification, isNotify ? styles.active : ''].join(' ')}
        title="Hooray!"
      >
        {name} has joined one of the boards!
      </Notification>

      <Tools opened={opened} close={close} />
      <Center>
        <Burger color="blue" className={styles.burger} opened={opened} onClick={toggle} />

        <DrawCanvas />
      </Center>
    </div>
  );
}

export default Main;
