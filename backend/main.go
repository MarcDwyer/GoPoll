package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func init() {
	fmt.Println(runtime.NumCPU())
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

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
