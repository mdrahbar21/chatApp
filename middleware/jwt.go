package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/spf13/viper"
)

type Error struct {
	IsError bool   `json:"isError"`
	Message string `json:"message"`
}

func SetError(err Error, message string) Error {
	err.IsError = true
	err.Message = message
	return err
}

func IsAuthorized(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		if r.Header["Authorization"] == nil {
			var err Error
			err = SetError(err, "No Token Found")
			json.NewEncoder(w).Encode(err)
			return
		}

		var secretKey = viper.GetString("JWT.SECRET")
		var mySigningKey = []byte(secretKey)
		tokenString := r.Header["Authorization"][0][7:]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("there was an error in parsing token")
			}
			return mySigningKey, nil
		})

		if err != nil {
			var err Error
			err = SetError(err, "Your Token has been expired.")
			json.NewEncoder(w).Encode(err)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			username := claims["username"].(string)
			r.Header.Set("username", username)
			handler.ServeHTTP(w, r)
			return
		}
		var reserr Error
		reserr = SetError(reserr, "Not Authorized.")
		json.NewEncoder(w).Encode(err)
	}
}

func GenerateJWT(username string) (string, error) {
	secretKey := viper.GetString("JWT.SECRET")
	var mySigningKey = []byte(secretKey)
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = username
	claims["exp"] = time.Now().Add(time.Minute * 500).Unix()

	tokenString, err := token.SignedString(mySigningKey)
	if err != nil {
		err = fmt.Errorf("something went Wrong: %s", err.Error())
		return "", err
	}

	return tokenString, nil
}
