import { ThemeOptions } from "@mui/material"

export const darkTheme: ThemeOptions = {
    components: {
        MuiModal: {
            styleOverrides: {
                root: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            },
        },
    },
    palette: {
        mode: "dark",
        primary: {
            main: "#595959", // dark grey (instead of soft black)
        },
        secondary: {
            main: "#F8F8F8", // soft white (instead of soft black)
        },
        error: {
            main: "#FF7F7F", // soft red
        },
        warning: {
            main: "#7F7FFF", // soft blue
        },
        info: {
            main: "#7FFF7F", // soft green
        },
        background: {
            default: "#303030", // dark grey for contrast to dark grey primary
            paper: "#424242", // even darker grey
        },
        text: {
            primary: "#F8F8F8", // soft white (instead of soft black)
            secondary: "#F3F3F3", // softer white
        },
    },
    typography: {
        fontFamily: "sans-serif",
        h1: {
            fontSize: "2rem",
            fontWeight: "bold",
        },
        h2: {
            fontSize: "1.5rem",
            fontWeight: "bold",
        },
        h3: {
            fontSize: "1.25rem",
            fontWeight: "bold",
        },
        h4: {
            fontSize: "1rem",
            fontWeight: "bold",
        },
        h5: {
            fontSize: "0.875rem",
            fontWeight: "bold",
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.5,
        },
        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.5,
        },
        button: {
            fontSize: "0.875rem",
            fontWeight: "bold",
            textTransform: "none",
        },
    },
}

export const lightTheme: ThemeOptions = {
    components: {
        MuiModal: {
            styleOverrides: {
                root: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            },
        },
    },
    palette: {
        mode: "light",
        primary: {
            main: "#F8F8F8", // soft white
        },
        secondary: {
            main: "#595959", // soft black
        },
        error: {
            main: "#FF7F7F", // soft red
        },
        warning: {
            main: "#7F7FFF", // soft blue
        },
        info: {
            main: "#7FFF7F", // soft green
        },
        background: {
            default: "#F0F0F0", // soft grey for slight contrast to soft white
            paper: "#F8F8F8", // soft white
        },
        text: {
            primary: "#595959", // soft black
            secondary: "#5E5E5E", // softer black
        },
    },
    typography: {
        fontFamily: "sans-serif",
        h1: {
            fontSize: "2rem",
            fontWeight: "bold",
        },
        h2: {
            fontSize: "1.5rem",
            fontWeight: "bold",
        },
        h3: {
            fontSize: "1.25rem",
            fontWeight: "bold",
        },
        h4: {
            fontSize: "1rem",
            fontWeight: "bold",
        },
        h5: {
            fontSize: "0.875rem",
            fontWeight: "bold",
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.5,
        },
        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.5,
        },
        button: {
            fontSize: "0.875rem",
            fontWeight: "bold",
            textTransform: "none",
        },
    },
}
