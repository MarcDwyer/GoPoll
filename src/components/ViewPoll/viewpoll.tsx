import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps<{ id: string }> {
    setWs: Function;
}

const ViewPoll = (props:IProps) => {
    return (
        <div className="create-poll results">
            <span>apple</span>
        </div>
    )
}

export default ViewPoll