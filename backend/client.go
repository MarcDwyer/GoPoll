package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"gopkg.in/mgo.v2/bson"

	"github.com/gorilla/websocket"
	mgo "gopkg.in/mgo.v2"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte

	id string
	ip string
}

type Upvote struct {
	ID     string `json:"id"`
	Upvote string `json:"upvote"`
	Type   string `json:"type"`
	Client *Client
}
type StandardMsg struct {
	Message string `json:"message"`
	Type    string `json:"type,omitempty"`
	Error   string `json:"error,omitempty"`
}

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		msg := Upvote{}
		json.Unmarshal(message, &msg)
		switch msg.Type {
		case "upvote":
			msg.Client = c
			fmt.Println(msg)
			go updatePoll(&msg)
			c.hub.broadcast <- msg
		default:
			fmt.Println("default ran...")
			c.hub.broadcast <- msg
		}
		//	message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		// c.hub.broadcast <- msg
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request, vars map[string]string) {
	IPAddress := r.Header.Get("X-Real-Ip")
	fmt.Println(IPAddress)

	if _, ok := vars["id"]; !ok {
		fmt.Println("id not found")
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256), id: vars["id"]}
	// this needs to be LocalAddr for deployment
	client.ip = client.conn.RemoteAddr().String()
	go client.writePump()
	go client.readPump()

	ch := getPoll(vars["id"])
	if ch == nil {
		fmt.Println("Poll could not be found")
		msg := StandardMsg{Message: "Poll could not be found", Type: "error", Error: "invalid_id"}
		rz, _ := json.Marshal(msg)
		client.send <- rz
		return
	}
	client.hub.register <- client
	client.send <- ch
}

func getPoll(id string) []byte {
	fmt.Println("sent post sent...")
	getPoll := &Poll{}
	payload := []byte{}

	if ok := bson.IsObjectIdHex(id); !ok {
		getPoll.Error = "ID not found"
		getPoll.Type = "invalid_id"
		return nil
	}
	session, err := mgo.Dial(os.Getenv("MONGODB"))
	if err != nil {
		panic(err)
	}
	defer session.Close()
	coll := session.DB("abase").C("pollsv2")

	err = coll.FindId(bson.ObjectIdHex(id)).One(&getPoll)
	if err != nil {
		getPoll.Error = "Poll not found"
		getPoll.Type = "not_found"
		return nil
	}
	getPoll.Type = "poll"
	payload, _ = json.Marshal(&getPoll)
	return payload
}

func updatePoll(p *Upvote) {
	session, err := mgo.Dial(os.Getenv("MONGODB"))
	if err != nil {
		panic(err)
	}
	defer session.Close()
	coll := session.DB("abase").C("pollsv2")
	str := fmt.Sprintf("pollQuestions.%v.count", p.Upvote)
	change := bson.M{"$inc": bson.M{str: 1}}
	err = coll.UpdateId(bson.ObjectIdHex(p.ID), change)
	if err != nil {
		fmt.Println("zone", err)
	}
}
