package alert

import (
	"database/sql"
	"fmt"
	"reflect"
	"testing"

	"EnergySaving/store"
	"github.com/DATA-DOG/go-sqlmock"
)

func TestStore_Add(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	dao := NewAlertDAO(db)

	tests := []struct {
		name    string
		alert   store.Alert
		wantErr bool
	}{
		{
			name: "success",
			alert: store.Alert{
				RoomID:   101,
				Status:   AlertOpen,
				ACID:     1,
				WindowID: 2,
				Reward:   100,
			},
			wantErr: false,
		},
		{
			name: "database error",
			alert: store.Alert{
				RoomID:   102,
				Status:   store.AlertClose,
				ACID:     3,
				WindowID: 4,
				Reward:   150,
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mock.ExpectExec("INSERT INTO alert").
				WithArgs(tt.alert.RoomID, tt.alert.Status, tt.alert.ACID, tt.alert.WindowID, tt.alert.Reward).
				WillReturnResult(sqlmock.NewResult(1, 1))

			if err := dao.Add(&tt.alert); (err != nil) != tt.wantErr {
				t.Errorf("Store.Add() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestStore_GetAlertList(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	dao := NewAlertDAO(db)

	tests := []struct {
		name    string
		mock    func()
		want    []*store.Alert
		wantErr bool
	}{
		{
			name: "success",
			mock: func() {
				rows := sqlmock.NewRows([]string{"id", "room_number", "status", "ac_id", "window_id", "reward", "solver", "solver_comment"}).
					AddRow(1, 101, AlertOpen, 1, 2, 100, 0, "").
					AddRow(2, 102, AlertClose, 3, 4, 150, 1, "Solved")
				mock.ExpectQuery("SELECT id, room_number, status, ac_id, window_id, reward, solver, solver_comment FROM alert").
					WillReturnRows(rows)
			},
			want: []*store.Alert{
				{ID: 1, RoomID: 101, Status: AlertOpen, ACID: 1, WindowID: 2, Reward: 100, Solver: 0, SolverComment: ""},
				{ID: 2, RoomID: 102, Status: AlertClose, ACID: 3, WindowID: 4, Reward: 150, Solver: 1, SolverComment: "Solved"},
			},
			wantErr: false,
		},
		{
			name: "database error",
			mock: func() {
				mock.ExpectQuery("SELECT id, room_number, status, ac_id, window_id, reward, solver, solver_comment FROM alert").
					WillReturnError(fmt.Errorf("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mock()

			got, err := dao.GetAlertList()
			if (err != nil) != tt.wantErr {
				t.Errorf("Store.GetAlertList() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Store.GetAlertList() = %v, want %v", got, tt.want)
			}
		})
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
