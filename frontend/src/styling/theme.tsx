import { DefaultTheme } from 'styled-components'

interface IPalette {
  background: string,
  primary: string,
  secondary: string,
  accent: string,
  contrastText: string,
  linkText?: string
}

interface fontSizes {
  bodySmall: string,
  bodyMedium: string,
  bodyLarge: string,
  titleTiny?: string,
  subheading?: string,
  titleSmall: string,
  titleMedium: string,
  titleLarge: string
}



declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
        common: {
          blackSquare: string,
          whiteSquare: string
        },
        main: IPalette,
      },
    fonts: {
      titleFonts: string,
      bodyFonts: string,
      sizes: fontSizes,
      mobileSizes: fontSizes
    },
    footerHeight: string;
  }
}

export const defaultTheme: DefaultTheme = {
  palette: {
    common: {
      blackSquare: '#8f0200',
      whiteSquare: '#ffafad'
    },
    main: {
      background: "#BFEAFF",
      primary: "rgb(255, 255, 0, 1)",
      secondary: "rgb(255, 255, 0, 1)",
      accent: "#FCFCD4",
      contrastText: '#000000'
    },
  },
  fonts: {
    titleFonts: "'Bungee', sans-serif",
    bodyFonts: "'Lexend', sans-serif",
    sizes: {
      bodySmall: "1rem",
      bodyMedium: "1.0rem",
      bodyLarge: "1.2rem",
      subheading: "4rem",
      titleTiny: "2.3rem",
      titleSmall: "2.7rem",
      titleMedium: "3.0rem",
      titleLarge: "3.3rem"
    },
    mobileSizes: {
      bodySmall: ".8rem",
      bodyMedium: "1rem",
      bodyLarge: "1.2rem",
      titleSmall: "2.4rem",
      titleMedium: "2.7rem",
      titleLarge: "3.0rem"
    }
  },
  footerHeight: "3rem",
}

export default defaultTheme