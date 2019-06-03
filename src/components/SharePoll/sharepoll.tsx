import React, { useState, useRef } from 'react'
import { TextField } from '@material-ui/core'
import { Button } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './sharepoll.scss'
import { makeStyles } from '@material-ui/core/styles';

interface Props {
    id: string | null;
    show: boolean;
}
const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));


const SharePoll = (props: Props) => {
    const { show, id } = props
    const str = props.id ? `${document.location.host}/vote/${[props.id]}` : "poo"
    const classes = useStyles()
    const [clicked, setClicked] = useState<boolean>(false)

    let welcome = useRef<HTMLDivElement | null>(null)
    const getClass = (): string => {
        if (props.id) return "share-id"
        if (show) return "welcome-screen"
        return ""
    }
    return (
        <div className={`master-share ${show || id ? "" : "hide"} ${getClass()}`} ref={welcome}>
            <div className="inner-share">
                {props.show && !props.id && (
                    <div className="welcome" style={welcome ? { height: welcome.current.clientHeight } : {}}>
                        <div>
                            <h2>Welcome to GoPoll!</h2>
                            <span>Create fast and free polls with real-time updates!</span>
                        </div>
                    </div>
                )}
                {props.id && (
                    <div>
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
                )}
            </div>
        </div>
    )
}

export default SharePoll