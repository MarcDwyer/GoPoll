import React from 'react'
import { TextField } from '@material-ui/core'
import './sharepoll.scss'

interface Props {
    id: string;
}

const SharePoll = (props: Props) => {
    console.log(props.id)
    return (
        <div className="master-share">
            <TextField 
            label="Share"
            defaultValue={props.id}
            />
        </div>
    )
}

export default SharePoll