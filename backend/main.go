package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("land lubbers!")

	hub := newHub()
	go hub.run()

	http.HandleFunc("/socket/", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	http.ListenAndServe(":5000", nil)
}
