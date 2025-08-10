package main

import (
	"log"
	"net/http"
)

func main() {
	// Set the directory to serve static files
	fs := http.FileServer(http.Dir("static/"))
	
	// Handle all requests by serving files from the directory
	http.Handle("/", fs)
	
	// Start the server on port 8080
	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
