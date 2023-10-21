package models

import "time"

type Channel struct {
	Name         string `gorm:"primary_key" json:"name"`
	Description  string `json:"description"`
	CreatedAt    int64  `json:"createdAt"`
	UserUsername string `json:"createdByUsername"`
	User         User   `gorm:"foreignkey:UserUsername;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`
	Members      []User `gorm:"many2many:channel_users;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}

func CreateChannel(name string, description string, username string) error {
	time := time.Now().Unix()
	channel := Channel{Name: name, Description: description, CreatedAt: time, UserUsername: username}
	err := db.Create(&channel).Error
	return err
}

func GetAllChannels() ([]Channel, error) {
	var channels []Channel
	err := db.Find(&channels).Error
	return channels, err
}

func DeleteChannel(name string) error {
	channel := Channel{Name: name}
	err := db.Delete(&channel).Error
	return err
}

func JoinChannel(name string, username string) error {
	channel := Channel{Name: name}
	err := db.First(&channel).Error
	if err != nil {
		return err
	}

	user := User{Username: username}
	err = db.First(&user).Error
	if err != nil {
		return err
	}

	err = db.Model(&channel).Association("Members").Append(&user)
	return err
}

func LeaveChannel(name string, username string) error {
	channel := Channel{Name: name}
	err := db.First(&channel).Error
	if err != nil {
		return err
	}

	user := User{Username: username}
	err = db.First(&user).Error
	if err != nil {
		return err
	}

	err = db.Model(&channel).Association("Members").Delete(&user)
	return err
}

func GetChannelMembers(name string) ([]UserResponse, error) {
	channel := Channel{Name: name}
	err := db.First(&channel).Error
	if err != nil {
		return nil, err
	}

	var members []User
	err = db.Model(&channel).Association("Members").Find(&members)

	var userResponses []UserResponse

	for _, member := range members {
		userResponses = append(userResponses, *UserToUserResponse(member))
	}

	return userResponses, err
}

func IsMemberOfChannel(name string, username string) (bool, error) {
	channel := Channel{Name: name}
	err := db.First(&channel).Error
	if err != nil {
		return false, err
	}

	var members []User
	err = db.Model(&channel).Association("Members").Find(&members)
	if err != nil {
		return false, err
	}

	for _, member := range members {
		if member.Username == username {
			return true, nil
		}
	}

	return false, nil
}
