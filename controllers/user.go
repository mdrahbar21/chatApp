package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/mdrahbar21/chatApp/models"
	"github.com/mdrahbar21/chatApp/utils"
	"github.com/gorilla/mux"
)

func ListAllUsers(w http.ResponseWriter, r *http.Request) {
	users, err := models.ListAllUsers()
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	res, err := json.Marshal(users)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["userId"]
	user, err := models.GetUser(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	res, err := json.Marshal(user)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

func GetUserChannels(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["userId"]
	channels, err := models.GetUserChannels(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	res, err := json.Marshal(channels)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
