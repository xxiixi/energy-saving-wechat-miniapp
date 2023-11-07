package alert

import (
	"EnergySaving/application"
	"EnergySaving/store"
)

type Alerts struct {
	Alerts []*store.Alert `json:"alerts"`
}

func GetAlertList(app *application.App) (string, error) {
	a, err := app.AlertStore.GetAlertList()
	if err != nil {
		return "", err
	}
	if len(a) == 0 {
		return "{}", nil
	}
	alerts := &Alerts{
		Alerts: a,
	}
	jsonBytes, err := json.Marshal(alert)
	if err != nil {
		return err
	}
	return string(jsonBytes), nil
}

func SolveAlert(app *application.App, alertID uint32,  user uint32, comment string) error {
	alert, err := app.AlertStore.GetAlert(alertID)
	if err != nil {
		return err
	}
	if alert.status == store.AlertClose {
		return nil
	}
	err = app.AlertStore.SolveAlert(alertID, user, comment)
	if err != nil {
		return err
	}
	point, err := app.UserStore.GetRewardsPoint(user)
	if err != nil {
		return err
	}
	return app.UserStore.UpdateRewardsPoint(user, point+alert.Reward)
}