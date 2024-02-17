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
  IconRectangle,
} from '@tabler/icons-react';

import styles from './Tools.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux';
import { paintSelector } from '@/redux/slices/paintSlice';
import { useState } from 'react';

type ToolsProps = {
  opened: boolean;
  close: () => void;
};

function Tools({ opened, close }: ToolsProps) {
  const { session } = useAppSelector(paintSelector);
  const dispatch = useAppDispatch();

  const [toolColor, setToolColor] = useState();

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
          <ActionIcon>
            <IconEraser />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Text">
          <ActionIcon>
            <IconLetterCase />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Brush">
          <ActionIcon>
            <IconBrush />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Rectangle">
          <ActionIcon>
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
          />
        ))}
      </Stack>
    </Drawer>
  );
}

export default Tools;
