import React, { useEffect, useRef, useState } from 'react';
import { Button, Center, Container, Flex, Grid, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import NameModal from '@/components/NameModal';
import { BoardData } from '@/interfaces';
import BoardCard from '@/components/BoardCard';

import styles from './Boards.module.scss';
import getUniqueId from '@/utils/getUniqueId';

function Boards() {
  const [boards, setBoards] = useState<BoardData[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  const createBoardHandle = () => {
    const boardId = getUniqueId();
    socketRef.current?.emit('boardsData', boardId);

    navigate(`/boards/${boardId}`);
  };

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BASE_URL);

    socketRef.current.on('boardsData', (data: BoardData[]) => {
      setBoards(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <NameModal />
      <Container size="lg">
        {boards.length === 0 ? (
          <Center p={40} className={styles.empty}>
            <Stack>
              <Text fw={700} fz={70}>
                You don&apos;t have any boards now :(
              </Text>
              <Button onClick={() => createBoardHandle()} ml="auto" w={300} variant="filled">
                Let&apos;s create a new one
              </Button>
            </Stack>
          </Center>
        ) : (
          <>
            <Flex direction="row" align="center">
              <Text fw={700} fz={70}>
                Just the boards . . .{' '}
              </Text>
              <Button onClick={() => createBoardHandle()} ml="auto" w={300} variant="filled">
                If you want, create a new one
              </Button>
            </Flex>
            <Grid>
              {boards.map((board, ind) => (
                <Grid.Col key={board.boardId} span={4}>
                  <BoardCard board={board} ind={ind} />
                </Grid.Col>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}

export default Boards;
