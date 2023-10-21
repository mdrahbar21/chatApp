package utils

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/spf13/viper"
)

func GetServerConfig() (string, string, string) {
	host := viper.GetString("SERVER.HOST")
	port := os.Getenv("PORT")
	if port == "" {
		port = viper.GetString("SERVER.PORT")
	}
	address := fmt.Sprintf("%s:%s", host, port)
	return address, host, port
}

func GetHandlerWithCORS(router *mux.Router) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	})
	handler := c.Handler(router)
	return handler
}
