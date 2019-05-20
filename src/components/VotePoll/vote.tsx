import React from 'react'
import { RouteComponentProps } from 'react-router';
import { Poll } from '../Main/main'

import './vote.scss'

interface IProps extends RouteComponentProps<{ id: string }> {
    ws: WebSocket;
    poll: Poll | null;
}


const ViewPoll = (props: IProps) => {
    console.log(props)
    return (
        <div className="create-poll view-poll">
            
        </div>
    )
}

export default ViewPoll