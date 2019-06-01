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
	register   chan *Client
	unregister chan *Client
}

type SubClients struct {
	Clients   map[*Client]bool
	Addresses map[string]bool
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan Upvote),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[string]SubClients),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			if _, ok := h.clients[client.id]; !ok {
				c, i := make(map[*Client]bool), make(map[string]bool)
				c[client] = true
				newEntry := &SubClients{Clients: c, Addresses: i}
				h.clients[client.id] = *newEntry
				go func() {
					time.Sleep(time.Hour * 1)
					delete(h.clients, client.id)
					deletePoll(client.id)
				}()
			} else {
				h.clients[client.id].Clients[client] = true
				h.clients[client.id].Addresses[client.ip] = true
			}
		case client := <-h.unregister:
			if _, ok := h.clients[client.id]; ok {
				fmt.Println("client dcd2")
				delete(h.clients[client.id].Clients, client)
				close(client.send)
			}
		case upvote := <-h.broadcast:
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
