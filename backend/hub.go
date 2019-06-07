package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Hub struct {
	clients    map[string]SubClients
	broadcast  chan Upvote
	register   chan *InitPoll
	unregister chan *Client
}

type SubClients struct {
	Clients   map[*Client]bool
	Addresses map[string]bool
	Filter    bool
}
type InitPoll struct {
	client   *Client
	ipFilter bool
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan Upvote),
		register:   make(chan *InitPoll),
		unregister: make(chan *Client),
		clients:    make(map[string]SubClients),
	}
}

func (h *Hub) run() {
	for {
		select {
		case initPoll := <-h.register:
			if _, ok := h.clients[initPoll.client.id]; !ok {
				c, i := make(map[*Client]bool), make(map[string]bool)
				c[initPoll.client] = true
				fmt.Println(initPoll.ipFilter)
				newEntry := &SubClients{Clients: c, Addresses: i, Filter: initPoll.ipFilter}
				h.clients[initPoll.client.id] = *newEntry
				go func() {
					time.Sleep(time.Hour * 6)
					delete(h.clients, initPoll.client.id)
					deletePoll(initPoll.client.id)
				}()
			} else {
				h.clients[initPoll.client.id].Clients[initPoll.client] = true
			}
		case client := <-h.unregister:
			if _, ok := h.clients[client.id]; ok {
				fmt.Println("client dcd2")
				delete(h.clients[client.id].Clients, client)
				close(client.send)
			}
		case upvote := <-h.broadcast:
			if os.Getenv("STAGE") == "production" && h.clients[upvote.ID].Filter && h.clients[upvote.ID].Addresses[upvote.Client.ip] {
				fmt.Println("ips have been matched...")
				msg := &StandardMsg{Message: "You already voted", Type: "duplicate_ip", Error: "duplicate_ip"}
				snd, _ := json.Marshal(*msg)
				upvote.Client.send <- snd
			} else {
				h.clients[upvote.ID].Addresses[upvote.Client.ip] = true
				upvotePayload, _ := json.Marshal(upvote)
				for client := range h.clients[upvote.ID].Clients {
					select {
					case client.send <- upvotePayload:
					default:
						close(client.send)
						delete(h.clients[upvote.ID].Clients, client)
					}
				}
			}
		}
	}
}

func deletePoll(id string) {
	session, err := mgo.Dial(os.Getenv("MONGODB"))
	if err != nil {
		panic(err)
	}
	defer session.Close()
	coll := session.DB("abase").C("pollsv2")

	err = coll.RemoveId(bson.ObjectIdHex(id))
	if err != nil {
		fmt.Println(err)
	}
}
