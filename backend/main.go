package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	// Set the content type to plain text
	w.Header().Set("Content-Type", "text/plain")

	// Read the request body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	// Log the request body to a file
	file, err := os.OpenFile("requests.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		http.Error(w, "Error opening log file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	if _, err := file.Write(body); err != nil {
		http.Error(w, "Error writing to log file", http.StatusInternalServerError)
		return
	}

	if _, err := file.WriteString("\n"); err != nil {
		http.Error(w, "Error writing to log file", http.StatusInternalServerError)
		return
	}

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
