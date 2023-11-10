package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	"EnergySaving/application"
	"EnergySaving/application/sensor"
	"EnergySaving/application/user"
	"EnergySaving/application/alert"
)

func addHandlers(app *application.App) {
	// set sensor status
	http.HandleFunc("/switch/status/set", setSwitchStatusHandlerWrapper(app))
	http.HandleFunc("/airconditioner/status/set", setACStatusHandlerWrapper(app))
	// alerts
	http.HandleFunc("/alert/list", alertListHandlerWrapper(app))
	http.HandleFunc("/alert/solve", solveAlertHandlerWrapper(app))
	http.HandleFunc("/user/rewards", getRewardsHandlerWrapper(app))
}

func setSwitchStatusHandlerWrapper(app *application.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		// Read the request body
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()
		// Parse the body content
		values, err := url.ParseQuery(string(bodyBytes))
		if err != nil {
			http.Error(w, "Error parsing request body", http.StatusBadRequest)
			return
		}
		statusVal := values.Get("status")
		var status sensor.Status
		switch statusVal {
		case "1":
			status = sensor.StatusOpen
		case "0":
			status = sensor.StatusClose
		default:
			http.Error(w, "Invalid status value in request body", http.StatusBadRequest)
			return
		}
		// Parse sensor_id and room_id
		sensorIDStr := values.Get("sensor_id")
		sensorID, err := strconv.ParseUint(sensorIDStr, 10, 32)
		if err != nil {
			http.Error(w, "Invalid sensor_id value in request body", http.StatusBadRequest)
			return
		}
		roomIDStr := values.Get("room_id")
		roomID, err := strconv.ParseUint(roomIDStr, 10, 32)
		if err != nil {
			http.Error(w, "Invalid room_id value in request body", http.StatusBadRequest)
			return
		}
		// Set the sensor status
		err = sensor.SetSwitchSensorStatus(app, uint32(sensorID), uint32(roomID), status)
		if err == nil {
			fmt.Fprintf(w, "OK")
		} else {
			fmt.Fprintf(w, "Error: %v", err)
		}
	}
}

func setACStatusHandlerWrapper(app *application.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		// Read the request body
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()
		// Parse the body content
		values, err := url.ParseQuery(string(bodyBytes))
		if err != nil {
			http.Error(w, "Error parsing request body", http.StatusBadRequest)
			return
		}
		statusVal := values.Get("status")
		var status sensor.Status
		switch statusVal {
		case "1":
			status = sensor.StatusOpen
		case "0":
			status = sensor.StatusClose
		default:
			http.Error(w, "Invalid status value in request body", http.StatusBadRequest)
			return
		}
		// Parse sensor_id and room_id
		sensorIDStr := values.Get("sensor_id")
		sensorID, err := strconv.ParseUint(sensorIDStr, 10, 32)
		if err != nil {
			http.Error(w, "Invalid sensor_id value in request body", http.StatusBadRequest)
			return
		}
		roomIDStr := values.Get("room_id")
		roomID, err := strconv.ParseUint(roomIDStr, 10, 32)
		if err != nil {
			http.Error(w, "Invalid room_id value in request body", http.StatusBadRequest)
			return
		}
		// Set the sensor status
		err = sensor.SetACSensorStatus(app, uint32(sensorID), uint32(roomID), status)
		if err == nil {
			fmt.Fprintf(w, "OK")
		} else {
			fmt.Fprintf(w, "Error: %v", err)
		}
	}
}

func alertListHandlerWrapper(app *application.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		// Set the sensor status
		alerts, err := alert.GetAlertList(app)
		if err == nil {
			fmt.Fprintf(w, alerts)
		} else {
			fmt.Fprintf(w, "Error: %v", err)
		}
	}
}

func solveAlertHandlerWrapper(app *application.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		// Read the request body
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()
		// Parse the body content
		values, err := url.ParseQuery(string(bodyBytes))
		if err != nil {
			http.Error(w, "Error parsing request body", http.StatusBadRequest)
			return
		}
		comment := values.Get("comment")
		// Parse sensor_id and room_id
		alertIDStr := values.Get("alert_id")
		alertID, err := strconv.ParseUint(alertIDStr, 10, 32)
		if err != nil {
			http.Error(w, "Invalid alert_id value in request body", http.StatusBadRequest)
			return
		}
		userIDStr := values.Get("user_id")
		userID, err := strconv.ParseUint(userIDStr, 10, 32)
		if err != nil {
			http.Error(w, "Invalid user_id value in request body", http.StatusBadRequest)
			return
		}
		err = alert.SolveAlert(app, uint32(alertID), uint32(userID), comment)
		if err == nil {
			fmt.Fprintf(w, "OK")
		} else {
			fmt.Fprintf(w, "Error: %v", err)
		}
	}
}

func getRewardsHandlerWrapper(app *application.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		// Read the request body
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()
		// Parse the body content
		values, err := url.ParseQuery(string(bodyBytes))
		if err != nil {
			http.Error(w, "Error parsing request body", http.StatusBadRequest)
			return
		}
		// Parse sensor_id and room_id
		id := values.Get("user_id")
		userID, err := strconv.ParseUint(id, 10, 32)
		if err != nil {
			http.Error(w, "Invalid userID value in request body", http.StatusBadRequest)
			return
		}
		// Set the sensor status
		point, err := user.GetUserRewardPoint(app, uint32(userID))
		if err == nil {
			fmt.Fprintf(w, strconv.FormatUint(uint64(point), 10))
		} else {
			fmt.Fprintf(w, "Error: %v", err)
		}
	}
}

func helloHandler(app *application.App, w http.ResponseWriter, r *http.Request) {
	// Set the content type to plain text
	w.Header().Set("Content-Type", "text/plain")
	// Read the request body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()
	// Write the response to the client
	fmt.Fprintf(w, "Hello dddddd "+string(body))
}
