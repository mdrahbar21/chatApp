package models

type Message struct {
	ID           uint    `gorm:"primary_key" json:"id"`
	Content      string  `json:"content"`
	TimeSentAt   int64   `json:"sentAt" gorm:"index:idx_time_sent_at"`
	UserUsername string  `json:"sentByUsername"`
	User         User    `gorm:"foreignkey:UserUsername;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`
	ChannelName  string  `json:"channelName" gorm:"index:idx_channel_name"`
	Channel      Channel `gorm:"foreignkey:ChannelName;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`
}

func CreateMessage(content string, timeSentAt int64, username string, channelId string) error {
	err := db.Create(&Message{Content: content, TimeSentAt: timeSentAt, UserUsername: username, ChannelName: channelId}).Error
	return err
}

func GetMessages(channelName string, timeStamp int64) ([]Message, error) {
	var messages []Message
	err := db.Where("channel_name = ? AND time_sent_at > ?", channelName, timeStamp).Find(&messages).Error
	return messages, err
}
