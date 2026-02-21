package main

import (
    "log"
    "net/http"

    "github.com/gorilla/mux"
	"github.com/Mauray-Jain/ayurtrace/backend/fabric-gateway/api"
	"github.com/Mauray-Jain/ayurtrace/backend/fabric-gateway/gateway"
)

func main() {
    // Initialize blockchain handler
    blockchainHandler := api.NewBlockchainHandler()

    // Initialize different gateways for different roles
    farmerGateway, err := gateway.NewGatewayConnection(
        "path/to/farmer/cert.pem",
        "path/to/farmer/key.pem",
        "FarmerMSP",
        "localhost:7051",
    )
    if err != nil {
        log.Fatal(err)
    }
    defer farmerGateway.Close()
    
    blockchainHandler.gateways["farmer"] = farmerGateway

    // Initialize router
    r := mux.NewRouter()

    // Register routes
    r.HandleFunc("/api/batch", blockchainHandler.CreateBatch).Methods("POST")
    r.HandleFunc("/api/quality-check", blockchainHandler.UploadQualityCheck).Methods("POST")
    // Add more routes as needed

    // Start server
    log.Fatal(http.ListenAndServe(":8080", r))
}
