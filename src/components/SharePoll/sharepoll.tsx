import React, { useState, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './sharepoll.scss'

interface Props extends RouteComponentProps {
    id: string | null;
    show: boolean;
}

const SharePoll = (props: Props) => {
    const { show, id } = props
    const str = props.id ? `${document.location.host}/vote/${[props.id]}` : ""
    const [clicked, setClicked] = useState<boolean>(false)

    let welcome = useRef<HTMLDivElement | null>(null)
    const getClass = (): string => {
        if (props.id) return "share-id"
        if (show) return "welcome-screen"
        return ""
    }
    if (props.location.pathname === "/" && clicked) setClicked(false)
    
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
                        <input
                            type="text"
                            className="input-design "
                            value={str}
                            readOnly={true}
                        />
                        <CopyToClipboard
                            text={str}
                            onCopy={() => setClicked(true)}
                        >
                            <button
                            className="share-btn"
                            >
                                {clicked ? "Copied!" : "Share your poll!"}
                            </button>
                        </CopyToClipboard>
                    </div>
                )}
            </div>
        </div>
    )
}

export default withRouter(SharePoll)