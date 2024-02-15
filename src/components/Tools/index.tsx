import React, { useState } from 'react';
import {
  ActionIcon,
  CheckIcon,
  ColorSwatch,
  DEFAULT_THEME,
  Divider,
  Drawer,
  Stack,
  Tooltip,
} from '@mantine/core';
import {
  IconBrush,
  IconCircle,
  IconEraser,
  IconFileExport,
  IconLayoutBoard,
  IconLetterCase,
  IconPencil,
  IconRectangle,
} from '@tabler/icons-react';

import styles from './Tools.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux';
import { paintSelector, setTool, setToolColor } from '@/redux/slices/paintSlice';
import Rectangle from '@/tools/Rectangle';
import Brush from '@/tools/Brush';
import Eraser from '@/tools/Eraser';

type ToolsProps = {
  opened: boolean;
  close: () => void;
};

function Tools({ opened, close }: ToolsProps) {
  const { canvas, tool } = useAppSelector(paintSelector);
  const dispatch = useAppDispatch();

  return (
    <Drawer
      withCloseButton={false}
      size={65}
      opened={opened}
      onClose={close}
      overlayProps={{ backgroundOpacity: 0 }}
    >
      <Stack className={styles.stack}>
        <Tooltip label="Boards">
          <ActionIcon>
            <IconLayoutBoard />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Export JPEG">
          <ActionIcon>
            <IconFileExport />
          </ActionIcon>
        </Tooltip>

        <Divider my="md" />

        <Tooltip label="Eraser">
          <ActionIcon onClick={() => dispatch(setTool(new Eraser(canvas)))}>
            <IconEraser />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Text">
          <ActionIcon>
            <IconLetterCase />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Brush">
          <ActionIcon onClick={() => dispatch(setTool(new Brush(canvas)))}>
            <IconBrush />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Rectangle">
          <ActionIcon onClick={() => dispatch(setTool(new Rectangle(canvas)))}>
            <IconRectangle />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Circle">
          <ActionIcon>
            <IconCircle />
          </ActionIcon>
        </Tooltip>

        <Divider my="md" />

        {[
          DEFAULT_THEME.colors.dark[8],
          DEFAULT_THEME.colors.red[8],
          DEFAULT_THEME.colors.green[8],
          DEFAULT_THEME.colors.blue[8],
          DEFAULT_THEME.colors.pink[6],
          DEFAULT_THEME.colors.yellow[5],
          DEFAULT_THEME.colors.violet[4],
        ].map((colorItem) => (
          <ColorSwatch
            key={colorItem}
            color={colorItem}
            onClick={() => setToolColor(colorItem)}
            className={styles.swatch}
          >
            {tool?.ctx?.strokeStyle === colorItem && <CheckIcon size="1rem" color="white" />}
          </ColorSwatch>
        ))}
      </Stack>
    </Drawer>
  );
}

export default Tools;
