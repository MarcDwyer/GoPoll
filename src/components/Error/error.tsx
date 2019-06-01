import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Error } from '../Main/main'
import { RouteComponentProps } from 'react-router'
import './error.scss'


interface Props extends RouteComponentProps {
    error: Error;
    clearError: Function;
}

const ErrorScreen = (props: Props) => {

    useEffect(() => {
        if (!props.error) {
            props.history.push("/")
            return
        }
    }, [])
    return (
        <div className="create-poll vote-error err">
            {props.error && (
                <div>
                    <span>{props.error.message}</span>
                    <Link
                        onClick={() => props.clearError()}
                        className="error-button" to="/"
                    >Create new poll</Link>
                </div>
            )}
        </div>
    )
}

export default ErrorScreen