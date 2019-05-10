package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	fmt.Println("land lubbers!")

	hub := newHub()
	go hub.run()
	r := mux.NewRouter()

	r.HandleFunc("/socket/{id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		fmt.Println(vars)
		serveWs(hub, w, r)
	})

	r.HandleFunc("/createpoll", creatPoll)
	http.ListenAndServe(":5000", r)
}

func creatPoll(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Createpoll ran...")
}
