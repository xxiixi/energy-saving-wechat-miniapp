package main

import (
	"fmt"
	"net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	// Set the content type to plain text
	w.Header().Set("Content-Type", "text/plain")
	// Write the response to the client
	fmt.Fprintf(w, "Hello dddddd")
}

func main() {
	// Define a handler for the '/temperature/set' route
	http.HandleFunc("/temperature/set", helloHandler)

	// Start the HTTP server on port 8080
	fmt.Println("Server is listening on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error:", err)
	}
}

