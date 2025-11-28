package livechat

import (
	"bomberman/src/store/models"
	"net/http"
	"regexp"
	"strings"

	"github.com/gorilla/websocket"
)

type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	send     chan []byte
	Username string
	Position models.Position // Використання загальної моделі
	Lives    int
}

// allowedOrigins contains the list of allowed origins for WebSocket connections
var allowedOrigins = map[string]bool{
	"http://localhost:3000":  true,
	"https://localhost:3000": true,
	"http://127.0.0.1:3000":  true,
	"https://127.0.0.1:3000": true,
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		if origin == "" {
			return true // Allow requests without Origin header (same-origin)
		}
		return allowedOrigins[origin]
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// validateUsername checks if the username is valid (alphanumeric, 1-10 chars)
var usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_]{1,10}$`)

func validateUsername(username string) bool {
	username = strings.TrimSpace(username)
	return usernameRegex.MatchString(username)
}

func (c *Client) Read() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			c.hub.unregister <- c
			c.conn.Close()
			break
		}
		c.hub.broadcast <- message
	}
}

func (c *Client) Write() {
	defer func() {
		c.conn.Close()
	}()
	for message := range c.send {
		w, err := c.conn.NextWriter(websocket.TextMessage)
		if err != nil {
			return
		}
		w.Write(message)
		for len(c.send) > 0 {
			w.Write(<-c.send)
		}
		if err := w.Close(); err != nil {
			return
		}
	}
}

func WebsocketHandler(hub *Hub, w http.ResponseWriter, r *http.Request) {
	username := strings.TrimSpace(r.URL.Query().Get("username"))

	// Validate username before upgrading connection
	if !validateUsername(username) {
		http.Error(w, "Invalid username: must be 1-10 alphanumeric characters", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not upgrade connection", http.StatusBadRequest)
		return
	}

	client := &Client{
		hub:      hub,
		conn:     conn,
		send:     make(chan []byte, 256),
		Username: username,
	}

	client.hub.register <- client
	go client.Write()
	go client.Read()
}
