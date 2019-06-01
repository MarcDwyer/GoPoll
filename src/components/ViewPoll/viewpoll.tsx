import React from 'react'
import { Poll } from '../Main/main'
import { Bar } from 'react-chartjs-2'
import './viewpoll.scss'

interface Props {
    poll: Poll | null;
}

const ViewPoll = (props: Props) => {
    let data = {}
    let total = 0
    let options = {}
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
            legend: {
                labels: {
                    fontColor: "black"
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        suggestedMin: 0,
                        suggestedMax: total,
                        fontColor: 'black',
                        stepSize: 1
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: 'black'
                    }
                }]
            }
        }
    }

    return (
        <div className={`create-poll results`}>
            {props.poll && (
                <Bar
                    data={data}
                    options={options}
                />
            )}
        </div>
    )
}

export default ViewPoll