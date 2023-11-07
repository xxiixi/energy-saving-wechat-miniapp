package alert

import (
	"fmt"
	"database/sql"

	"EnergySaving/store"
)

type Store struct {
	db *sql.DB
}

func NewAlertDAO(db *sql.DB) *Store {
	return &Store{db: db}
}

func (dao *Store) Add(alert *store.Alert) error {
	// Create the SQL query to insert a new alert into the database
	query := "INSERT INTO alert (room_number, status, solver, ac_id, window_id, reward, solver_comment, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
	// Execute the query
	_, err := dao.db.Exec(query, alert.RoomID, alert.Status, alert.Solver, alert.ACID, alert.WindowID, alert.Reward, alert.SolverComment, alert.AlertType)
	if err != nil {
			return err
	}
	return nil
}

func (dao *Store) GetAlertList() ([]*store.Alert, error) {
	// Create a slice to store the retrieved alert records
	alerts := []*store.Alert{}
	// Create the SQL query to select alert records from the database
	query := "SELECT id, room_number, status, solver, ac_id, window_id, reward, solver_comment, type FROM alert"
	// Execute the query
	rows, err := dao.db.Query(query)
	if err != nil {
			return nil, err
	}
	defer rows.Close()
	// Iterate over the result rows and populate the alerts slice
	for rows.Next() {
			var alert store.Alert
			err := rows.Scan(&alert.ID, &alert.RoomID, &alert.Status, &alert.Solver, &alert.ACID, &alert.WindowID, &alert.Reward, &alert.SolverComment, &alert.AlertType)
			if err != nil {
					return nil, err
			}
			alerts = append(alerts, &alert)
	}
	return alerts, nil
}

func (dao *Store) SolveAlert(id uint32, solver uint32, comment string) error {
	// Create the SQL query to update the alert's status, solver, and comment
	query := "UPDATE alert SET status = ?, solver = ?, solver_comment = ? WHERE id = ?"
	// Execute the query
	_, err := dao.db.Exec(query, store.AlertClose, solver, comment, id)
	if err != nil {
			return err
	}
	return nil
}

func (dao *Store) GetAlert(id uint32) (*store.Alert, error) {
	// Create a variable to store the retrieved alert
	var alert store.Alert
	// Create the SQL query to select an alert by its ID
	query := "SELECT id, room_number, status, solver, ac_id, window_id, reward, solver_comment, type FROM alert WHERE id = ?"
	// Execute the query and scan the result into the alert variable
	err := dao.db.QueryRow(query, id).Scan(&alert.ID, &alert.RoomID, &alert.Status, &alert.Solver, &alert.ACID, &alert.WindowID, &alert.Reward, &alert.SolverComment, &alert.AlertType)
	if err != nil {
		if err == sql.ErrNoRows {
			// If no rows were found, return nil and a custom error to indicate that the alert was not found
			return nil, fmt.Errorf("alert not found")
		}
		return nil, err
	}
	// Return the retrieved alert
	return &alert, nil
}
