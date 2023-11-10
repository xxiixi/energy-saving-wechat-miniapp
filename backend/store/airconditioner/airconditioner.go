package airconditioner

import (
	"database/sql"

	"EnergySaving/store"
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

func (dao *Store) GetRoomStatus(roomID uint32) (uint32, store.Status, error) {
	query := `SELECT sensor_id, status FROM air_conditioner WHERE room_id = ?`
	rows, err := dao.db.Query(query, roomID)
	if err != nil {
		return 0, store.StatusClose, err
	}
	defer rows.Close()
	for rows.Next() {
		var sensorID uint32
		var sensorStatus store.Status
		err := rows.Scan(&sensorID, &sensorStatus)
		if err != nil {
			return 0, store.StatusClose, err
		}
		if sensorStatus == store.StatusOpen {
			return sensorID, store.StatusOpen, nil
		}
	}
	if err := rows.Err(); err != nil {
		return 0, store.StatusClose, err
	}
	return 0, store.StatusClose, nil
}
