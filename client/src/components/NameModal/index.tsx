import React, { useRef } from 'react';
import { Button, Input, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '@/redux';
import { paintSelector, setUsername } from '@/redux/slices/paintSlice';

function NameModal() {
  const dispatch = useAppDispatch();
  const { username } = useAppSelector(paintSelector);
  const [isModalOpened, { close: modalClose }] = useDisclosure(!username);

  const inputRef = useRef<HTMLInputElement>(null);

  const entireHandle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current) return;

    dispatch(setUsername(inputRef.current.value));
    modalClose();
  };

  return (
    <Modal
      opened={isModalOpened}
      onClose={() => username && modalClose()}
      withCloseButton={false}
      title="Write your nickname here"
    >
      <form onSubmit={entireHandle}>
        <Input required ref={inputRef} />
        <Button type="submit" mt={20} w="100%">
          Happy drawing!
        </Button>
      </form>
    </Modal>
  );
}

export default NameModal;
