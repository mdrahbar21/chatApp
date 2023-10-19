package main

import (
	log "github.com/sirupsen/logrus"

	"net/http"

	"github.com/mdrahbar21/chatApp/routes"
	"github.com/mdrahbar21/chatApp/utils"
)

func main() {

	router := routes.Setup()
	handler := utils.GetHandlerWithCORS(router)
	address, _, port := utils.GetServerConfig()

	log.Info("Starting server at port ", port)

	err := http.ListenAndServe(address, handler)

	if err != nil {
		log.Error("Error starting server: ", err)
		return
	}

}
