package temperature

import (
	"database/sql"
	"fmt"
	"time"
)

type Store struct {
	db *sql.DB
}

func NewTemperatureDAO(sqlAddress, username, password string) (*Store, error) {
	connStr := fmt.Sprintf("%s:%s@tcp(%s)/energy?parseTime=true", username, password, sqlAddress)
	db, err := sql.Open("mysql", connStr)
	if err != nil {
		return nil, err
	}

	// Set up database connection pooling
	db.SetMaxOpenConns(10)                 // Maximum number of connections in the pool
	db.SetMaxIdleConns(5)                  // Maximum number of idle connections in the pool
	db.SetConnMaxLifetime(time.Minute * 5) // Maximum time a connection may be reused

	return &Store{db: db}, nil
}

func (dao *Store) Update(sensorID uint32, roomID uint32, temperature int32) error {
	// Begin a transaction
	tx, err := dao.db.Begin()
	if err != nil {
		return err
	}
	query := `UPDATE temperature SET room_id=?, temperature=?, update_time=CURRENT_TIMESTAMP WHERE sensor_id=?`
	_, err = tx.Exec(query, roomID, temperature, sensorID)
	if err != nil {
		tx.Rollback() // If an error occurred, rollback the transaction
		return err
	}
	return tx.Commit() // Commit the transaction
}

func (dao *Store) GetRoomTemperature(sensorID uint32) (int32, error) {
	query := `SELECT temperature FROM temperature WHERE room_id=?`
	row := dao.db.QueryRow(query, sensorID)
	var tem int32
	err := row.Scan(&tem)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil // No result found
		}
		return 0, err
	}
	return tem, nil
}
