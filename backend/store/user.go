package store

type AlertStatus int

const (
	AlertOpen  AlertStatus = 0
	AlertClose AlertStatus = 1
)

type Alert struct {
	ID            uint32     `json:"id"`
	RoomID        uint32     `json:"room_id"`
	ACID          uint32     `json:"ac_id"`
	WindowID      uint32     `json:"window_id"`
	Status        AlertStatus `json:"status"`
	Solver        uint32     `json:"solver"`
	Reward        uint32     `json:"reward"`
	SolverComment string     `json:"solver_comment"`
}

// AlertStore alert store
type AlertStore interface {
	Add(alert *Alert) error
	GetAlertList() ([]*Alert, error)
	// update AlertType to close and update solver and comment
	SolveAlert(id uint32, solver uint32, comment string) error
	GetAlert(id uint32)(*Alert, error)
}

// UserStore user store
type UserStore interface {
	GetRewardsPoint(user_id uint32) (uint32, error)
	UpdateRewardsPoint(user_id uint32, rewards uint32) error
}