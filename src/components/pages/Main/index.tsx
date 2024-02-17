import React, { useRef } from 'react';
import { Burger, Button, Center, Input, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import Tools from '@/components/Tools';
import DrawCanvas from '@/components/DrawCanvas';

import styles from './Main.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux';
import { paintSelector, setUsername } from '@/redux/slices/paintSlice';

function Main() {
  const { username } = useAppSelector(paintSelector);
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const [opened, { close, toggle }] = useDisclosure(false);
  const [isModalOpened, { close: modalClose }] = useDisclosure(true);

  const entireHandle = () => {
    if (!inputRef.current) return;

    dispatch(setUsername(inputRef.current.value));
    modalClose();
  };

  return (
    <div>
      <Modal
        opened={isModalOpened}
        onClose={modalClose}
        withCloseButton={false}
        title="Write your nickname"
      >
        <Input ref={inputRef} />
        <Button onClick={() => entireHandle()}>Let&apos;s draw!</Button>
      </Modal>
      <Tools opened={opened} close={close} />
      <Center>
        <Burger color="blue" className={styles.burger} opened={opened} onClick={toggle} />

        <DrawCanvas />
      </Center>
    </div>
  );
}

export default Main;
