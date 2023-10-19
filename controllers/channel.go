package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/mdrahbar21/chatApp/tree/master/models"
	"github.com/mdrahbar21/chatApp/tree/master/utils"
	"github.com/gorilla/mux"
)

type CreateChannelRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func CreateChannel(w http.ResponseWriter, r *http.Request) {
	createChannelRequest := &CreateChannelRequest{}
	err := utils.ParseBody(r, createChannelRequest)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	username := r.Header.Get("username")
	err = models.CreateChannel(createChannelRequest.Name, createChannelRequest.Description, username)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetAllChannels(w http.ResponseWriter, r *http.Request) {
	channels, err := models.GetAllChannels()
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

func DeleteChannel(w http.ResponseWriter, r *http.Request) {
	channelId := mux.Vars(r)["channelId"]
	err := models.DeleteChannel(channelId)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
}

func JoinChannel(w http.ResponseWriter, r *http.Request) {
	channelId := mux.Vars(r)["channelId"]
	username := r.Header.Get("username")
	err := models.JoinChannel(channelId, username)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
}

func LeaveChannel(w http.ResponseWriter, r *http.Request) {
	channelId := mux.Vars(r)["channelId"]
	username := r.Header.Get("username")
	err := models.LeaveChannel(channelId, username)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
}

func GetChannelMembers(w http.ResponseWriter, r *http.Request) {
	channelId := mux.Vars(r)["channelId"]
	members, err := models.GetChannelMembers(channelId)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	res, err := json.Marshal(members)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

func IsMemberOfChannel(w http.ResponseWriter, r *http.Request) {
	channelId := mux.Vars(r)["channelId"]
	username := r.Header.Get("username")
	isMember, err := models.IsMemberOfChannel(channelId, username)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	res, err := json.Marshal(isMember)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
