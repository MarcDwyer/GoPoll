package main

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	clients    map[string]map[*Client]bool
	broadcast  chan Message
	register   chan *Client
	unregister chan *Client
}
type SubPoll struct {
	id *Client
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
			h.clients[client.id][client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client.id]; ok {
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
