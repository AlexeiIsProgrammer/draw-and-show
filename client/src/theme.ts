import { ColorSwatch, createTheme } from '@mantine/core';

export const theme = createTheme({
  components: {
    ColorPicker: ColorSwatch.extend({
      classNames: {
        root: '.mantine-ColorPicker-swatch',
      },
      styles: {
        root: {
          width: '10px',
          height: '10px',
        },
      },
    }),
  },
});
