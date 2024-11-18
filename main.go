package main

import (
	"bomberman/src/app"
	livechat "bomberman/src/app/ws"
	"bomberman/src/server"
)

func main() {
	app := app.NewApp()
	server := server.NewServer(app)
	hub := livechat.InitHub()

	hub.LaunchRoutines()
	server.Start(hub)

}
