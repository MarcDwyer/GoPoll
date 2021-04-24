import React from 'react'

import './about.scss'

const About = () => {
    return (
        <div className="master-about create-poll">
            <div className="inner-about">
                <h2>Welcome to ©GoPoll.me</h2>
                <p>
                    GoPoll a free and fast real-time poll application!
                        </p>
                <div className="social">
                    <div className="github">
                        <a className="fa fa-github"
                            href="https://github.com/MarcDwyer/GoPoll"
                            rel="noopener noreferrer"
                            target="_blank"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About