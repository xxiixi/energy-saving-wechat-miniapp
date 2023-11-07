package user

import (
	"database/sql"
)

type Store struct {
	db *sql.DB
}

func NewUserDAO(db *sql.DB) *Store {
	return &Store{db: db}
}

func (dao *Store) GetRewardsPoint(user_id uint32) (uint32, error) {
	var rewards uint32
	// Create the SQL query to select rewards points for the given user_id
	query := "SELECT rewards FROM user WHERE user_id = ?"
	// Execute the query and scan the result into the rewards variable
	err := dao.db.QueryRow(query, user_id).Scan(&rewards)
	if err != nil {
			if err == sql.ErrNoRows {
					// Handle the case where no user with the given user_id is found
					return 0, nil
			}
			return 0, err
	}
	return rewards, nil
}

func (dao *Store) UpdateRewardsPoint(user_id uint32, rewards uint32) error {
	query := `
	INSERT INTO user (user_id, rewards) 
	VALUES (?, ?) 
	ON DUPLICATE KEY UPDATE rewards = VALUES(rewards)
	`
	_, err := dao.db.Exec(query, user_id, rewards)
	if err != nil {
		return err
	}
	return nil
}