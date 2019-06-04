import React, { useState, useRef, useEffect } from 'react'
import './createpoll.scss'
import { RouteComponentProps } from 'react-router';
import Checkbox from '@material-ui/core/Checkbox';

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'

interface IProps extends RouteComponentProps<{ id: string }> {
}
interface Poll {
    question: string;
    ipFilter: boolean;
    pollQuestions: PollQ;
}
interface PollQ {
    [key: string]: any;
    poll1: string;
    poll2: string;
    poll3: string;
    poll4: string;
    poll5: string;
    poll6: string;
    poll7: string;
    poll8: string;
}
const orangizePayload = (payload: Poll) => {
    const pollQuest = Object.keys(payload.pollQuestions).map(key => {
        const { pollQuestions } = payload
        if (pollQuestions[key].length === 0) return
        return { [key]: pollQuestions[key] }
    }).filter(item => item).reduce((obj, i) => {
        const key = Object.keys(i)
        const value = Object.values(i)
        obj[key[0]] = { pollOption: value[0] }
        return obj
    }, {})

    return {
        question: payload.question,
        ipFilter: payload.ipFilter,
        pollQuestions: pollQuest
    }
}

const schema = yup.object().shape({
    question: yup.string().required("Poll must have a question").max(78),
    pollQuestions: yup.object().shape({
        poll1: yup.string().required("Required field").max(48, "Must be shorter than 48 characters"),
        poll2: yup.string().required("Required field").max(48, "Must be shorter than 48 characters"),
        poll3: yup.string().max(48, "Must be shorter than 48 characters"),
        poll4: yup.string().max(48, "Must be shorter than 48 characters"),
        poll5: yup.string().max(48, "Must be shorter than 48 characters"),
        poll6: yup.string().max(48, "Must be shorter than 48 characters"),
        poll7: yup.string().max(48, "Must be shorter than 48 characters"),
        poll8: yup.string().max(48, "Must be shorter than 48 characters")
    })
})

const CreatePoll = (props: IProps) => {
    const [waiter, setWaiter] = useState<boolean>(false)
    const [ierr, setIerr] = useState<string | null>(null)
    let counter = useRef<number>(2)

    return (
        <div className="create-poll">
            {ierr && (
                <h2 className="error">{ierr}</h2>
            )}
            <Formik
                initialValues={{
                    question: "",
                    ipFilter: false,
                    pollQuestions: {
                        poll1: "",
                        poll2: "",
                        poll3: "",
                        poll4: "",
                        poll5: "",
                        poll6: "",
                        poll7: "",
                        poll8: ""
                    }
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setWaiter(true)
                    const payload = orangizePayload(values)
                    try {
                        const send = await fetch("/createpoll", {
                            method: 'POST',
                            body: JSON.stringify(payload)
                        })
                        const data: string = await send.json();
                        if (!data) return
                        setWaiter(false)
                        props.history.push(`/vote/${data}`)
                    } catch (err) {
                        setTimeout(() => {
                            setWaiter(false)
                        }, 1000)
                        setIerr("Sever error... try again")
                    }
                }}
            >
                {({ values }) => (
                    <Form
                    >
                        <div className="poll-content">
                            <Field
                                name="question"
                                className="question input-design"
                                placeholder="Enter your question here"
                                autoComplete="off"
                            />
                            <ErrorMessage
                                name={`question`}
                                component="span"
                            />
                            {Object.keys(values.pollQuestions).map((key: string, i: number) => {
                                if (i >= counter.current) return
                                const val = values.pollQuestions[`poll${counter.current}`]
                                if (val && val.length > 1) {
                                    counter.current += 1
                                }
                                return (
                                    <div
                                        className="master-div"
                                        key={key}
                                    >
                                        <div className="subdiv">
                                            <div className="circle"></div>
                                            <Field
                                                key={key}
                                                placeholder={"Enter poll option"}
                                                name={`pollQuestions.${key}`}
                                                className="input-design"
                                                autoComplete="off"
                                                type="text"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name={`pollQuestions.${key}`}
                                            component="span"
                                            className="custom-error"
                                        />
                                    </div>
                                )
                            })}
                            <Field
                                type="checkbox"
                                name="ipFilter"
                                checked={values.ipFilter}
                                value={values.ipFilter}
                                render={({ field, form }) => {
                                    return (
                                        <label>
                                            <Checkbox
                                                {...field}
                                            />
                                            Check for duplicate Ips?
                                           </label>
                                    )
                                }}
                            />
                            <div className="button-div">
                                <button type="submit" disabled={waiter} className={`submit-button ${waiter ? "off-button" : ""}`}>
                                    {waiter ? "Waiting..." : "Submit"}
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CreatePoll