import React, { useState, useRef } from 'react'
import { TextField } from '@material-ui/core'
import { Button } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './sharepoll.scss'
import { makeStyles } from '@material-ui/core/styles';

interface Props {
    id: string | null;
}
const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));


const SharePoll = React.memo((props: Props) => {
    const str = props.id ? `${document.location.host}/vote/${[props.id]}` : "poo"
    const classes = useStyles()
    const [clicked, setClicked] = useState<boolean>(false)
    return (
        <div className={`master-share ${props.id ? "" : "hide"}`}>
            <div className="inner-share">
                <TextField
                    label="Share your poll!"
                    value={str}
                />
                <CopyToClipboard
                text={str}
                onCopy={() => setClicked(true)}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        className={classes.button}
                    >
                        {clicked ? "Copied!" : "Share"}
                    </Button>
                </CopyToClipboard>
            </div>
        </div>
    )
})
export default SharePoll