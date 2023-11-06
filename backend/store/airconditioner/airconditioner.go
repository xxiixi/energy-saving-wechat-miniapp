package airconditioner

import (
	"EnergySaving/store"
	"database/sql"
)

type Store struct {
	db *sql.DB
}

func NewACSensorDAO(db *sql.DB) *Store {
	return &Store{db: db}
}

func (dao *Store) UpdateStatus(sensorID uint32, roomID uint32, status store.Status) error {
	query := `INSERT INTO air_conditioner (sensor_id, room_id, status) VALUES (?, ?, ?)
	          ON DUPLICATE KEY UPDATE status = ?`
	_, err := dao.db.Exec(query, sensorID, roomID, status, status)
	return err
}

func (dao *Store) GetRoomStatus(roomID uint32) (store.Status, error) {
	query := `SELECT status FROM air_conditioner WHERE room_id = ?`
	rows, err := dao.db.Query(query, roomID)
	if err != nil {
		return store.StatusClose, err
	}
	defer rows.Close()
	var sensorStatus store.Status
	for rows.Next() {
		err := rows.Scan(&sensorStatus)
		if err != nil {
			return store.StatusClose, err
		}
		if sensorStatus == store.StatusOpen {
			return store.StatusOpen, nil
		}
	}
	if err := rows.Err(); err != nil {
		return store.StatusClose, err
	}
	return store.StatusClose, nil
}
