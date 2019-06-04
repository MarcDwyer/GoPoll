import React from 'react'

import './about.scss'

const About = () => {
    return (
        <div className="master-about create-poll">
            <div className="inner-about">
                <h2>Welcome to GoPoll.me</h2>
                <p>
                    GoPoll is free and open source for all to see!
                        </p>
                <div className="social">
            <a className="fa fa-github"
                        href="https://github.com/MarcDwyer/GoPoll"
                        target="_blank"
                    />
                </div>
            </div>
        </div>
    )
}

export default About