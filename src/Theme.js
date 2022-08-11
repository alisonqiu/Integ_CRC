import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    // mode: 'dark',
    voyageTrans: {
      main: "#42a5f5"
    },
    voyageIntra: {
      main: "#ab47bc"
    },
    whiteIcon: {
      main: "#f5f5f5"
    }
  },
});

export const switchTheme = createTheme({
  palette: {
    mode: 'dark',
    blackMode: {
      main:"#424242"
    },
    voyageTrans: {
      main: "#42a5f5"
    },
    voyageIntra: {
      main: "#ab47bc"
    }
  },
  // components: {
  //   MuiToggleButton: {
  //     styleOverrides: {
  //       root: {
  //         "&.Mui-selected": {
  //           color: "#1b5e20",
  //         },
  //       }
  //     }
  //   }
  // }
})