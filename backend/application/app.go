package application

import (
	"database/sql"
	"fmt"
	"time"

	"EnergySaving/store"
	"EnergySaving/store/airconditioner"
	"EnergySaving/store/switchsensor"
	"EnergySaving/store/alert"
	"EnergySaving/store/user"

	_ "github.com/go-sql-driver/mysql"
)

func NewEnergyDB(sqlAddress, username, password string) (*sql.DB, error) {
	connStr := fmt.Sprintf("%s:%s@tcp(%s)/energy?parseTime=true", username, password, sqlAddress)
	db, err := sql.Open("mysql", connStr)
	if err != nil {
		return nil, err
	}
	// Set up database connection pooling
	db.SetMaxOpenConns(10)                 // Maximum number of connections in the pool
	db.SetMaxIdleConns(5)                  // Maximum number of idle connections in the pool
	db.SetConnMaxLifetime(time.Minute * 5) // Maximum time a connection may be reused
	return db, nil
}

type App struct {
	ACSensorStore     store.ACSensor
	SwitchSensorStore store.SwitchSensor
	AlertsStore       store.AlertStore
	UserStore         store.UserStore
}

func NewApp() (*App, error) {
	tStore, err := NewEnergyDB("10.0.12.17:3306", "test", "qunxyd-6nogmu-pettoS")
	if err != nil {
		return nil, err
	}
	return &App{
		ACSensorStore:     airconditioner.NewACSensorDAO(tStore),
		SwitchSensorStore: switchsensor.NewSwitchSensorDAO(tStore),
		AlertsStore:       alert.NewAlertDAO(tStore),
		UserStore:         user.NewUserDAO(tStore),
	}, nil
}
