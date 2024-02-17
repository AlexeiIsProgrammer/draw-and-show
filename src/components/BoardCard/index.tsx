import React from 'react';
import { Box, Card, Image, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { BoardData } from '@/interfaces';

import styles from './BoardCard.module.scss';

type BoardCardProps = {
  board: BoardData;
  ind: number;
};

function BoardCard({ board, ind }: BoardCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className={styles.card}
      onClick={() => navigate(board.boardId)}
      shadow="sm"
      padding="xl"
      component="li"
    >
      <Card.Section>
        {board.image ? <Image src={board.image} h={160} alt="Board image" /> : <Box h={160} />}
      </Card.Section>

      <Text fw={500} size="lg" mt="md">
        Join the #{ind + 1} table
      </Text>
    </Card>
  );
}

export default BoardCard;
