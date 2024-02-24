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
import { useNavigate } from 'react-router-dom';

import styles from './Tools.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux';
import { paintSelector, setTool, setToolConfig } from '@/redux/slices/paintSlice';

type ToolsProps = {
  opened: boolean;
  close: () => void;
};

function Tools({ opened, close }: ToolsProps) {
  const { tool, image } = useAppSelector(paintSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const exportToJPEG = () => {
    const base64ImageData = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const binaryBlob = atob(base64ImageData);

    const arrayBuffer = new ArrayBuffer(binaryBlob.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryBlob.length; i += 1) {
      uint8Array[i] = binaryBlob.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });

    const link = document.createElement('a');
    link.download = 'Your little board.jpg';
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Drawer
      withOverlay={false}
      withCloseButton={false}
      size={65}
      opened={opened}
      onClose={close}
      overlayProps={{ backgroundOpacity: 0 }}
    >
      <Stack className={styles.stack}>
        <Tooltip label="Boards">
          <ActionIcon onClick={() => navigate('/')}>
            <IconLayoutBoard />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Export JPEG">
          <ActionIcon onClick={() => exportToJPEG()}>
            <IconFileExport />
          </ActionIcon>
        </Tooltip>

        <Divider my="md" />

        <Tooltip label="Eraser">
          <ActionIcon
            className={tool.name === 'eraser' ? styles.active : ''}
            onClick={() => dispatch(setTool({ ...tool, name: 'eraser' }))}
          >
            <IconEraser />
          </ActionIcon>
        </Tooltip>

        <ActionIcon
          disabled
          className={tool.name === 'text' ? styles.active : ''}
          onClick={() => dispatch(setTool({ ...tool, name: 'text' }))}
        >
          <IconLetterCase />
        </ActionIcon>

        <Tooltip label="Brush">
          <ActionIcon
            className={tool.name === 'brush' ? styles.active : ''}
            onClick={() => dispatch(setTool({ ...tool, name: 'brush' }))}
          >
            <IconBrush />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Rectangle">
          <ActionIcon
            className={tool.name === 'rect' ? styles.active : ''}
            onClick={() => dispatch(setTool({ ...tool, name: 'rect' }))}
          >
            <IconRectangle />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Circle">
          <ActionIcon
            className={tool.name === 'circle' ? styles.active : ''}
            onClick={() => dispatch(setTool({ ...tool, name: 'circle' }))}
          >
            <IconCircle />
          </ActionIcon>
        </Tooltip>

        <Divider my="md" />

        {[
          DEFAULT_THEME.white,
          DEFAULT_THEME.colors.red[8],
          DEFAULT_THEME.colors.green[8],
          DEFAULT_THEME.colors.blue[8],
          DEFAULT_THEME.colors.pink[6],
          DEFAULT_THEME.colors.yellow[5],
        ].map((colorItem) => (
          <ColorSwatch
            key={colorItem}
            color={colorItem}
            onClick={() => dispatch(setToolConfig({ property: 'color', value: colorItem }))}
            className={[styles.swatch, colorItem === tool.color ? styles['active-color'] : ''].join(
              ' '
            )}
          />
        ))}
      </Stack>
    </Drawer>
  );
}

export default Tools;
