package app

import (
	h "bomberman/src/app/handlers"
	livechat "bomberman/src/app/ws"
	"net/http"
)

type App struct {
}

func NewApp() *App {
	return &App{}
}

// ServeHTTP handles the incoming HTTP requests and routes them to the appropriate handlers.
func (a *App) ServeHTTP(hub *livechat.Hub) {
	http.HandleFunc("/api/join", func(w http.ResponseWriter, r *http.Request) {
		h.HandlerJoin(w, r, hub)
	})
}
