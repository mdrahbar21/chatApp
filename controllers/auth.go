package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/mdrahbar21/chatApp/tree/master/middleware"
	"github.com/mdrahbar21/chatApp/tree/master/models"
	"github.com/mdrahbar21/chatApp/tree/master/utils"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type SignupRequest struct {
	Username    string `json:"username"`
	Password    string `json:"password"`
	Name        string `json:"name"`
	PhoneNo     string `json:"phoneNo"`
	Designation string `json:"designation"`
	AvatarURL   string `json:"avatarURL"`
}

type JWTResponse struct {
	Token string `json:"token"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	loginRequest := &LoginRequest{}
	err := utils.ParseBody(r, loginRequest)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	err = models.Login(loginRequest.Username, loginRequest.Password)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	jwt, err := middleware.GenerateJWT(loginRequest.Username)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	token := &JWTResponse{Token: jwt}

	res, err := json.Marshal(token)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)

}

func Signup(w http.ResponseWriter, r *http.Request) {
	signupRequest := &SignupRequest{}
	err := utils.ParseBody(r, signupRequest)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	err = models.Signup(signupRequest.Username, signupRequest.Password, signupRequest.Name, signupRequest.PhoneNo, signupRequest.Designation, signupRequest.AvatarURL)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
}
