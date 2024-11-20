package models

type Message struct {
	Type   string `json:"type"`
	Body   string `json:"body"`
	Sender string `json:"sender"`
}

type Connected struct {
	Type      string   `json:"type"`
	Body      string   `json:"body"`
	Sender    string   `json:"sender"`
	Connected []string `json:"connected"`
}

type TimerMsg struct {
	Type string `json:"type"`
	Body int    `json:"body"`
}

type MoveMessage struct {
	Type      string   `json:"type"`
	Sender    string   `json:"sender"`
	Direction string   `json:"direction"`
	Position  Position `json:"position"` // Використання загальної структури Position
}

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
}
