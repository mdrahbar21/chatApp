package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/mdrahbar21/chatApp/tree/master/models"
	"github.com/mdrahbar21/chatApp/tree/master/utils"
	"github.com/gorilla/mux"
)

type CreateMessageRequest struct {
	Content string `json:"content"`
}

func CreateMessage(w http.ResponseWriter, r *http.Request) {
	username := r.Header.Get("username")
	params := mux.Vars(r)
	channelID := params["channelId"]
	createMessageRequest := &CreateMessageRequest{}
	err := utils.ParseBody(r, createMessageRequest)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	timeSentAt := time.Now().Unix()

	err = models.CreateMessage(createMessageRequest.Content, timeSentAt, username, channelID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetMessages(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	channelID := params["channelId"]

	queryParams := r.URL.Query()
	timeStamp := queryParams.Get("after_time")

	if timeStamp == "" {
		timeStamp = "0"
	}

	timeStampInt, err := strconv.ParseInt(timeStamp, 10, 64)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	var messages []models.Message

	messages, err = models.GetMessages(channelID, timeStampInt)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	res, err := json.Marshal(messages)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)

}
