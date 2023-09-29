const parseError = (error: any) => {
    console.log(error)
    let errorMessage = "Undefined error"
    if (
        error.response?.data?.message !== undefined &&
        error.response.data.message !== ""
    ) {
        errorMessage = error.response.data.message
    } else if (
        error.response?.statusText !== undefined &&
        error.response.statusText !== ""
    ) {
        errorMessage = error.response.statusText
    } else if (error.message !== undefined) {
        errorMessage = error.message
    }
    return errorMessage
}

export default parseError
