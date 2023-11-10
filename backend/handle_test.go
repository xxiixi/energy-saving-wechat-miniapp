package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"EnergySaving/application"
	"EnergySaving/application/sensor"
	"EnergySaving/application/alert"
	"EnergySaving/application/user"
	"EnergySaving/store"
)

func TestSetSwitchStatusHandler(t *testing.T) {
	// Create a new instance of your application (or use a mock if applicable)
	app := &application.App{}
	// Create a test HTTP request with the desired method, path, and request body
	reqBody := "sensor_id=1&room_id=2&status=1"
	req, err := http.NewRequest("POST", "/switch/status/set", strings.NewReader(reqBody))
	if err != nil {
		t.Fatal(err)
	}
	// Create a response recorder to capture the HTTP response
	rr := httptest.NewRecorder()
	// Call the handler function
	setSwitchStatusHandlerWrapper(app)(rr, req)
	// Check the response status code
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, but got %d", http.StatusOK, rr.Code)
	}
	// Check the response body
	expectedResponse := "OK"
	if body := rr.Body.String(); body != expectedResponse {
		t.Errorf("Expected response body '%s', but got '%s'", expectedResponse, body)
	}
}

func TestSetACStatusHandler(t *testing.T) {
	// Create a new instance of your application (or use a mock if applicable)
	app := &application.App{}
	// Create a test HTTP request with the desired method, path, and request body
	reqBody := "sensor_id=1&room_id=2&status=1"
	req, err := http.NewRequest("POST", "/airconditioner/status/set", strings.NewReader(reqBody))
	if err != nil {
		t.Fatal(err)
	}
	// Create a response recorder to capture the HTTP response
	rr := httptest.NewRecorder()
	// Call the handler function
	setACStatusHandlerWrapper(app)(rr, req)
	// Check the response status code
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, but got %d", http.StatusOK, rr.Code)
	}
	// Check the response body
	expectedResponse := "OK"
	if body := rr.Body.String(); body != expectedResponse {
		t.Errorf("Expected response body '%s', but got '%s'", expectedResponse, body)
	}
}

func TestAlertListHandler(t *testing.T) {
	// Create a new instance of your application (or use a mock if applicable)
	app := &application.App{}
	// Create a test HTTP request with the desired method and path
	req, err := http.NewRequest("GET", "/alert/list", nil)
	if err != nil {
		t.Fatal(err)
	}
	// Create a response recorder to capture the HTTP response
	rr := httptest.NewRecorder()
	// Mock the behavior of the AlertsStore to return a list of alerts
	app.AlertsStore = &mockAlertsStore{
		alerts: []*store.Alert{
			{
				ID:        1,
				AlertType: alert.AlertRunningAC,
				RoomID:    2,
				Status:    alert.AlertOpen,
			},
			{
				ID:        2,
				AlertType: alert.AlertOpenWindow,
				RoomID:    3,
				Status:    alert.AlertOpen,
			},
		},
	}
	// Call the handler function
	alertListHandlerWrapper(app)(rr, req)
	// Check the response status code
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, but got %d", http.StatusOK, rr.Code)
	}
	// Validate the response body based on the mock data
	expectedResponse := `{"alerts":[{"id":1,"alert_type":0,"room_id":2,"status":0},{"id":2,"alert_type":1,"room_id":3,"status":0}]}`
	if body := rr.Body.String(); body != expectedResponse {
		t.Errorf("Expected response body '%s', but got '%s'", expectedResponse, body)
	}
}

// MockAlertsStore is a mock implementation of the AlertsStore interface
type mockAlertsStore struct {
	alerts []*store.Alert
}

func (m *mockAlertsStore) GetAlertList() ([]*store.Alert, error) {
	return m.alerts, nil
}

func TestSolveAlertHandler(t *testing.T) {
	// Create a new instance of your application (or use a mock if applicable)
	app := &application.App{}
	// Create a test HTTP request with the desired method, path, and request body
	reqBody := "alert_id=1&user_id=2&comment=test_comment"
	req, err := http.NewRequest("POST", "/alert/solve", strings.NewReader(reqBody))
	if err != nil {
		t.Fatal(err)
	}
	// Create a response recorder to capture the HTTP response
	rr := httptest.NewRecorder()
	// Mock the behavior of the AlertsStore and UserStore to simulate alert solving
	app.AlertsStore = &mockAlertsStore{
		alerts: []*store.Alert{
			{
				ID:        1,
				AlertType: alert.AlertRunningAC,
				RoomID:    2,
				Status:    alert.AlertOpen,
				Reward:    100, // Set an initial reward value
			},
		},
	}
	app.UserStore = &mockUserStore{
		rewards: map[uint32]uint32{
			2: 50, // Set an initial reward value for the user
		},
	}
	// Call the handler function
	solveAlertHandlerWrapper(app)(rr, req)
	// Check the response status code
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, but got %d", http.StatusOK, rr.Code)
	}
	// Check the response body
	expectedResponse := "OK"
	if body := rr.Body.String(); body != expectedResponse {
		t.Errorf("Expected response body '%s', but got '%s'", expectedResponse, body)
	}
	// Verify that the alert was solved correctly
	// Retrieve the alert and user rewards after solving
	alertID := uint32(1)
	userID := uint32(2)
	rewardAfterSolving, err := app.UserStore.GetRewardsPoint(userID)
	if err != nil {
		t.Errorf("Error getting user rewards: %v", err)
	}
	alertAfterSolving, err := app.AlertsStore.GetAlert(alertID)
	if err != nil {
		t.Errorf("Error getting alert: %v", err)
	}
	// Check that the alert's status is now closed and the user's rewards have been updated
	if alertAfterSolving.Status != alert.AlertClose {
		t.Errorf("Expected alert status to be closed, but got open")
	}
	expectedRewardAfterSolving := uint32(150) // Initial reward (50) + Alert reward (100)
	if rewardAfterSolving != expectedRewardAfterSolving {
		t.Errorf("Expected user rewards to be %d, but got %d", expectedRewardAfterSolving, rewardAfterSolving)
	}
}

func (m *mockAlertsStore) GetAlert(alertID uint32) (*store.Alert, error) {
	for _, a := range m.alerts {
		if a.ID == alertID {
			return a, nil
		}
	}
	return nil, alert.ErrAlertNotFound
}

func (m *mockAlertsStore) SolveAlert(alertID, userID uint32, comment string) error {
	alert, err := m.GetAlert(alertID)
	if err != nil {
		return err
	}
	alert.Status = alert.AlertClose
	alert.Solver = userID
	alert.SolverComment = comment
	return nil
}

// MockUserStore is a mock implementation of the UserStore interface
type mockUserStore struct {
	rewards map[uint32]uint32
}

func (m *mockUserStore) GetRewardsPoint(userID uint32) (uint32, error) {
	reward, ok := m.rewards[userID]
	if !ok {
		return 0, user.ErrUserNotFound
	}
	return reward, nil
}

func (m *mockUserStore) UpdateRewardsPoint(userID, points uint32) error {
	m.rewards[userID] = points
	return nil
}

func TestGetRewardsHandler(t *testing.T) {
	// Create a new instance of your application (or use a mock if applicable)
	app := &application.App{}

	// Create a test HTTP request with the desired method, path, and request body
	reqBody := "user_id=2"
	req, err := http.NewRequest("POST", "/user/rewards", strings.NewReader(reqBody))
	if err != nil {
		t.Fatal(err)
	}
	// Create a response recorder to capture the HTTP response
	rr := httptest.NewRecorder()
	// Mock the behavior of the UserStore to simulate getting user rewards
	app.UserStore = &mockUserStore{
		rewards: map[uint32]uint32{
			2: 100, // Set an initial reward value for the user
		},
	}
	// Call the handler function
	getRewardsHandlerWrapper(app)(rr, req)
	// Check the response status code
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, but got %d", http.StatusOK, rr.Code)
	}
	// Validate the response body based on the mock data
	expectedResponse := "100"
	if body := rr.Body.String(); body != expectedResponse {
		t.Errorf("Expected response body '%s', but got '%s'", expectedResponse, body)
	}
}