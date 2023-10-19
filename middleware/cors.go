package middleware

import (
	"net/http"
)

func setPolicy(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")

	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Authorization, content-type")
	// (*w).Header().Set("Access-Control-Allow-Credentials", "true")
}

func CORS(endpoint func(w http.ResponseWriter, r *http.Request)) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// println("CORS")
		// // setPolicy(&w, r)
		// // cors
		// w.Header().Set("Access-Control-Allow-Origin", "")
		// w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")

		// if r.Method == "OPTIONS" {
		// 	return
		// }
		endpoint(w, r)
	}
}
