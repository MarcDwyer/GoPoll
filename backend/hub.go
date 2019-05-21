package main

import (
	"fmt"
	"os"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Hub struct {
	clients    map[string]map[*Client]bool
	broadcast  chan Message
	register   chan *Client
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[string]map[*Client]bool),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			if _, ok := h.clients[client.id]; !ok {
				newEntry := map[*Client]bool{client: true}
				h.clients[client.id] = newEntry
				go func() {
					time.Sleep(time.Hour * 24)
					delete(h.clients, client.id)
					deletePoll(client.id)
				}()
			} else {
				h.clients[client.id][client] = true
			}
		case client := <-h.unregister:
			if _, ok := h.clients[client.id]; ok {
				fmt.Println("client dcd2")
				delete(h.clients[client.id], client)
				close(client.send)
			}
		case clientMsg := <-h.broadcast:
			for client := range h.clients[clientMsg.id] {
				select {
				case client.send <- clientMsg.message:
				default:
					close(client.send)
					delete(h.clients[clientMsg.id], client)
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
