package config

import (
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

func init() {
	viper.AddConfigPath(".")
	viper.AddConfigPath("../")
	viper.SetConfigName("config")
	viper.SetConfigType("yml")

	err := viper.ReadInConfig()
	if err != nil {
		log.Error("Error reading config file: ", err)
		panic(err)
	}
}
