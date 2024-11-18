package server

import (
	"bomberman/src/app"
	livechat "bomberman/src/app/ws"
	"log"
	"net/http"
)

type Server struct {
	app *app.App
}

// NewServer creates a new instance of the Server struct with the provided app.
func NewServer(app *app.App) *Server {
	return &Server{app: app}
}

func (s *Server) Start(hub *livechat.Hub) {
	http.HandleFunc("/api/ws", func(w http.ResponseWriter, r *http.Request) {
		livechat.WebsocketHandler(hub, w, r)
	})
	s.app.ServeHTTP(hub)
	log.Println("Server is listening on port 8080...")
	http.ListenAndServe("localhost:8080", nil)
}
