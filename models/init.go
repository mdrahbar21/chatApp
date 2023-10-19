package models

import (
	"github.com/mdrahbar21/chatApp/config"
	"gorm.io/gorm"
)

var db *gorm.DB

func init() {
	config.ConnectDB()
	db = config.GetDB()
	db.AutoMigrate(&Channel{})
	db.AutoMigrate(&Message{})
	db.AutoMigrate(&User{})
	Signup("h", "123", "Rahbar", "1234567890", "Developer", "https://mdrahbar21.github.io/avatar.png")
	Signup("kd", "123", "KD LAB PC", "1234567890", "Tester", "https://avatars0.githubusercontent.com/u/17098281?s=460&v=4")
	Signup("guest", "guest", "Guest", "1234567890", "Guest", "https://avatars0.githubusercontent.com/u/17098584?s=460&v=4")
	CreateChannel("general", "general convo", "h")
}
