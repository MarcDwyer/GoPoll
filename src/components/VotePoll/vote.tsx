import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps<{ id: string }> {
    ws: WebSocket;
    setWs: Function;
}


const ViewPoll = (props: IProps) => {
    useEffect(() => {
        const { id } = props.match.params
        props.setWs(id)
    }, [])
    return (
        <div className="create-poll view-poll">
        
        </div>
    )
}

export default ViewPoll