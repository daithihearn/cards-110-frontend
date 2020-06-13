
class ErrorUtils {
    parseError(error) {
        let errorMessage = 'Undefined error';
        if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined &&
        error.response.data.message !== ''
        ) {
        errorMessage = error.response.data.message;
        } else if (
        error.response !== undefined &&
        error.response.statusText !== undefined &&
        error.response.statusText !== ''
        ) {
        errorMessage = error.response.statusText;
        } else if (error.message !== undefined) {
        errorMessage = error.message;
        }
        return { snackOpen: true, snackMessage: errorMessage, snackType: "error" };
    }
}

const errorUtils = new ErrorUtils();

export default errorUtils;