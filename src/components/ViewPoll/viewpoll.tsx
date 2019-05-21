import React from 'react'
import { Error, Poll } from '../Main/main'
interface Props {
    poll: Poll | null;
    error: Error | null;
}

const ViewPoll = (props:Props) => {
    return (
        <div className="create-poll results">
            <span>apple</span>
        </div>
    )
}

export default ViewPoll