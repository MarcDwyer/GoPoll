import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router';
import { Poll } from '../Main/main'

import './vote.scss'

interface IProps extends RouteComponentProps<{ id: string }> {
    ws: WebSocket;
    setWs: Function;
    poll: Poll | null;
}


const ViewPoll = (props: IProps) => {
    return (
        <div className="create-poll view-poll">
            
        </div>
    )
}

export default ViewPoll