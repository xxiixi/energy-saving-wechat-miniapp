package user

import (
	"EnergySaving/application"
)

// GetUserRewardPoint get user reward point
func GetUserRewardPoint(app *application.App, userID uint32) (uint32, error) {
	return app.UserStore.GetRewardsPoint(user)
}