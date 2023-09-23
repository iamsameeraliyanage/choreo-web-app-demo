package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/sirupsen/logrus"
)

const todoAPIURL = "http://localhost:8080" // Put your original Todo API URL here

func extractUserIDFromJWT(tokenString string) (string, error) {
	// Parse the token
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return "", fmt.Errorf("invalid jwt, failed to parse [%v]", err)
	}
	// Assert the token claims to jwt.MapClaims
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if sub, ok := claims["sub"].(string); ok {
			return sub, nil
		} else {
			return "", fmt.Errorf("invalid jwt, `sub` claim not found or not a string: %v", claims["sub"])
		}
	}
	return "", fmt.Errorf("invalid jwt")
}

func ProxyHandler(c *fiber.Ctx) error {
	jwt := c.Get("x-jwt-assertion", "")
	if jwt == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "missing x-jwt-assertion header"})
	}

	userID, err := extractUserIDFromJWT(jwt)
	if err != nil {
		logrus.WithError(err).Error("Error extracting user ID from JWT")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid jwt"})
	}

	// Construct the new request URL
	requestURL := todoAPIURL + "/users/" + userID + c.Path()

	// Create a new request
	req, err := http.NewRequest(c.Method(), requestURL, bytes.NewReader(c.Request().Body()))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Make the request to the original Todo API
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	defer resp.Body.Close()

	_, err = io.Copy(c.Response().BodyWriter(), resp.Body)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	c.Response().Header.SetContentType(resp.Header.Get("Content-Type"))
	return c.SendStatus(resp.StatusCode)
}

func main() {
	app := fiber.New()

	// Setting up proxy routes
	app.Get("/todos", ProxyHandler)
	app.Post("/todos", ProxyHandler)
	app.Get("/todos/:id", ProxyHandler)
	app.Put("/todos/:id", ProxyHandler)
	app.Delete("/todos/:id", ProxyHandler)

	log.Fatal(app.Listen(":4000"))
}
