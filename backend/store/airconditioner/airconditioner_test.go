package airconditioner

import (
    "testing"
    
    "database/sql"
    "EnergySaving/store"

    "github.com/golang/mock/gomock"
		"github.com/golang/mock/gomock"
    mock_sql "EnergySaving/store/mock"
)

func TestUpdateStatus(t *testing.T) {
    mockCtrl := gomock.NewController(t)
    defer mockCtrl.Finish()

    mockDB := mock_sql.NewMockDB(mockCtrl)
    dao := NewACSensorDAO(mockDB)

    // Define test cases
    tests := []struct {
        sensorID uint32
        roomID uint32
        status store.Status
        wantErr bool
    }{
        {
					sensorID: 1,
					roomID: 2,
					status: store.StatusClose, 
					wantErr: false,
				}
    }

    for _, tt := range tests {
        mockDB.EXPECT().Exec(gomock.Any(), tt.sensorID, tt.roomID, tt.status, tt.status).Return(nil, nil)
        if err := dao.UpdateStatus(tt.sensorID, tt.roomID, tt.status); (err != nil) != tt.wantErr {
            t.Errorf("UpdateStatus() error = %v, wantErr %v", err, tt.wantErr)
        }
    }
}

func TestGetRoomStatus(t *testing.T) {
    mockCtrl := gomock.NewController(t)
    defer mockCtrl.Finish()

    mockDB := mock_sql.NewMockDB(mockCtrl)
    dao := NewACSensorDAO(mockDB)

    // Define test cases
    tests := []struct {
        roomID uint32
        wantSensorID uint32
        wantStatus store.Status
        wantErr bool
    }{
      {
				roomID : 123,
        wantSensorID : 123,
        wantStatus : store.StatusClose,
        wantErr : false,
			}
    }

    for _, tt := range tests {
        rows := sqlmock.NewRows([]string{"sensor_id", "status"}).AddRow(tt.wantSensorID, tt.wantStatus)
        mockDB.EXPECT().Query(gomock.Any(), tt.roomID).Return(rows, nil)
        sensorID, status, err := dao.GetRoomStatus(tt.roomID)
        if (err != nil) != tt.wantErr {
            t.Errorf("GetRoomStatus() error = %v, wantErr %v", err, tt.wantErr)
        }
        if sensorID != tt.wantSensorID || status != tt.wantStatus {
            t.Errorf("GetRoomStatus() got = %v, %v, want %v, %v", sensorID, status, tt.wantSensorID, tt.wantStatus)
        }
    }
}
