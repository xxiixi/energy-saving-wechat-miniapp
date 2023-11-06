package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	"EnergySaving/application"
	"EnergySaving/application/sensor"
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
		helloHandler(app, w, r)
	}
}

func solveAlertHandlerWrapper(app *application.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		helloHandler(app, w, r)
	}
}

func getRewardsHandlerWrapper(app *application.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		helloHandler(app, w, r)
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
