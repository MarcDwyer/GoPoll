import React from 'react'
import { Poll } from '../Main/main'
import { HorizontalBar } from 'react-chartjs-2'
import './viewpoll.scss'

interface Props {
    poll: Poll | null;
}

const ViewPoll = (props: Props) => {
    let data = {}
    let total = 0
    let options = {}
    let size = {
        height: window.innerWidth < 1000 ? 100 : 55,
        width: 100
    }
    if (props.poll) {
        const pollData = Object.values(props.poll.pollQuestions)
        const obj = {
            labels: pollData.map(obj => `${obj.pollOption} ${obj.count} votes`),
            datasets: [
                {
                    label: props.poll.question,
                    data: pollData.map(obj => obj.count),
                    backgroundColor: "rgba(178,53,53,.75)",
                    hoverBackgroundColor: "rgba(178,53,53,.85)"
                }
            ]
        }
        total = pollData.reduce((int, item) => {
            return int += item.count
        }, 0)
        data = obj

        options = {
            maintainAspectRatio: true,
            legend: {
                labels: {
                    fontColor: "black"
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: 'black',
                        fontStyle: "bold",
                        stepSize: 1
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: 'black',
                        fontStyle: "bold",
                        beginAtZero: true,
                        suggestedMin: 0,
                        suggestedMax: total,
                    }
                }]
            }
        }
    }

    return (
        <div className={`create-poll results`}>
            {props.poll && (
                <HorizontalBar
                    height={size.height}
                    width={size.width}
                    data={data}
                    options={options}
                />
            )}
        </div>
    )
}

export default ViewPoll