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
        MuiCssBaseline: {
            styleOverrides: {
                ".carpet": {
                    background:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='37' height='37' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(60)'%3E%3Crect width='100%25' height='100%25' fill='rgba(34, 84, 61,1)'/%3E%3Ccircle cx='20' cy='20' r='1' fill='%23f6e05e'/%3E%3Ccircle cx='30' cy='20' r='1' fill='%23d69e2e'/%3E%3Ccircle cx='20' cy='30' r='1' fill='%23d69e2e'/%3E%3Ccircle cx='10' cy='20' r='1' fill='%23d69e2e'/%3E%3Ccircle cx='20' cy='10' r='1' fill='%23d69e2e'/%3E%3Ccircle cx='30' cy='20' r='1' fill='%23d69e2e'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E \")",
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    overflow: "overlay",
                },
                ".dummy": {
                    backgroundImage: "url('/assets/img/dummy-light.png')",
                },
                ".cards-background": {
                    backgroundImage: "url('/assets/img/mycards-light.png')",
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
        MuiCssBaseline: {
            styleOverrides: {
                ".carpet": {
                    background:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='37' height='37' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(60)'%3E%3Crect width='100%25' height='100%25' fill='rgba(178, 245, 234,1)'/%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(45, 55, 72,1)'/%3E%3Ccircle cx='30' cy='20' r='1' fill='rgba(34, 84, 61,1)'/%3E%3Ccircle cx='20' cy='30' r='1' fill='rgba(34, 84, 61,1)'/%3E%3Ccircle cx='10' cy='20' r='1' fill='rgba(34, 84, 61,1)'/%3E%3Ccircle cx='20' cy='10' r='1' fill='rgba(34, 84, 61,1)'/%3E%3Ccircle cx='30' cy='20' r='1' fill='rgba(34, 84, 61,1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E \")",
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    overflow: "overlay",
                },
                ".dummy": {
                    backgroundImage: "url('/assets/img/dummy-dark.png')",
                },
                ".cards-background": {
                    backgroundImage: "url('/assets/img/mycards-dark.png')",
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
