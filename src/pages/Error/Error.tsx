import React from "react"
import { useRouteError } from "react-router-dom"
import parseError from "../../utils/ErrorUtils"

const ErrorPage = () => {
    const error = useRouteError()
    console.error(error)

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{parseError(error)}</i>
            </p>
        </div>
    )
}

export default ErrorPage
