package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Poll struct {
	Id            bson.ObjectId       `json:"_id,omitempty" bson:"_id"`
	Question      string              `json:"question,omitempty"`
	PollQuestions []map[string]string `json:"pollquestions,omitempty"`
	Error         string              `json:"error,omitempty"`
	Type          string              `json:"type,omitempty"`
}

func creatPoll(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")

	session, err := mgo.Dial(os.Getenv("MONGODB"))
	if err != nil {
		panic(err)
	}
	defer session.Close()
	c := session.DB("abase").C("pollsv2")

	poll := &Poll{}
	json.NewDecoder(r.Body).Decode(&poll)
	if poll == nil {
		return
	}
	for _, v := range poll.PollQuestions {
		v["count"] = "0"
	}

	poll.Id = bson.NewObjectId()
	err = c.Insert(*poll)
	if err != nil {
		fmt.Println(err)
	}
	rz, _ := json.Marshal(poll.Id)
	w.Write(rz)
}
