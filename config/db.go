package config

import (
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func ConnectDB() {
	dataSource := viper.GetString("DATABASE.NAME")
	log.Info("Connecting to database: ", viper.GetString("DATABASE.NAME"))
	database, err := gorm.Open(sqlite.Open(dataSource), &gorm.Config{})
	if err != nil {
		log.Error("Error connecting to database: ", err)
		panic(err)
	}
	db = database

	if res := db.Exec("PRAGMA foreign_keys = ON", nil); res.Error != nil {
		panic(res.Error)
	}
}

func GetDB() *gorm.DB {
	return db
}
