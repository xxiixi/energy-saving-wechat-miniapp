package main

import (
	"EnergySaving/application"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	// Open or create a file
	f, err := os.OpenFile("server.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	// Set the log output to the file
	log.SetOutput(f)
	app, err := application.NewApp()
	if err != nil {
		log.Println("Start app error:", err)
		return
	}
	// add HTTP handler
	addHandlers(app)
	// Start the HTTP server on port 8080
	fmt.Println("Server is listening on :8080...")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error:", err)
	}
}
