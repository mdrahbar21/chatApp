package routes

import (
	"net/http"

	"github.com/mdrahbar21/chatApp/controllers"
	"github.com/mdrahbar21/chatApp/middleware"
	"github.com/gorilla/mux"
)

func Setup() *mux.Router {
	r := mux.NewRouter()
	RegisterRoutes(r)
	buildHandler := http.FileServer(http.Dir("./web/build"))
	r.PathPrefix("/").Handler(buildHandler)
	http.Handle("/", r)
	return r
}

func RegisterRoutes(router *mux.Router) {

	// Hello World
	// router.HandleFunc("/", controllers.Index).Methods("GET")

	// Channel
	router.HandleFunc("/channel", middleware.CORS(middleware.IsAuthorized(controllers.CreateChannel))).Methods("POST")
	router.HandleFunc("/channels", middleware.CORS(middleware.IsAuthorized(controllers.GetAllChannels))).Methods("GET")
	router.HandleFunc("/channel/{channelId}", middleware.CORS(middleware.IsAuthorized(controllers.DeleteChannel))).Methods("DELETE")
	router.HandleFunc("/channel/{channelId}/membership", middleware.CORS(middleware.IsAuthorized(controllers.JoinChannel))).Methods("POST")
	router.HandleFunc("/channel/{channelId}/membership", middleware.CORS(middleware.IsAuthorized(controllers.LeaveChannel))).Methods("DELETE")
	router.HandleFunc("/channel/{channelId}/membership", middleware.CORS(middleware.IsAuthorized(controllers.IsMemberOfChannel))).Methods("GET")
	router.HandleFunc("/channel/{channelId}/members", middleware.CORS(middleware.IsAuthorized(controllers.GetChannelMembers))).Methods("GET")

	// Message
	router.HandleFunc("/channel/{channelId}/message", middleware.CORS(middleware.IsAuthorized(controllers.CreateMessage))).Methods("POST")
	router.HandleFunc("/channel/{channelId}/messages", middleware.CORS(middleware.IsAuthorized(controllers.GetMessages))).Methods("GET")

	// User
	router.HandleFunc("/user/login", middleware.CORS(controllers.Login)).Methods("POST")
	router.HandleFunc("/user/signup", middleware.CORS(controllers.Signup)).Methods("POST")
	router.HandleFunc("/users", middleware.CORS(middleware.IsAuthorized(controllers.ListAllUsers))).Methods("GET")
	router.HandleFunc("/user/{userId}", middleware.CORS(middleware.IsAuthorized(controllers.GetUser))).Methods("GET")
	router.HandleFunc("/user/{userId}/channels", middleware.CORS(middleware.IsAuthorized(controllers.GetUserChannels))).Methods("GET")
}
