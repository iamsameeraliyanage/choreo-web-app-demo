/*
 * Todo API
 *
 * A simple Todo API
 *
 * API version: 1.0.0
 * Generated by: Swagger Codegen (https://github.com/swagger-api/swagger-codegen.git)
 */
package swagger

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type Routes []Route

func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	router.Use(func(h http.Handler) http.Handler {
		// set correlation id if not present
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			correlationId := r.Header.Get("X-Correlation-Id")
			if correlationId == "" {
				id, _ := uuid.NewRandom()
				correlationId = fmt.Sprintf("todosvc-%s", id.String())
				r.Header.Set("X-Correlation-Id", correlationId)
			}
			h.ServeHTTP(w, r)
		})
	})
	for _, route := range routes {
		var handler http.Handler
		handler = route.HandlerFunc
		handler = Logger(handler, route.Name)

		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)
	}

	return router
}

func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World!")
}

var routes = Routes{
	Route{
		"Index",
		"GET",
		"/",
		Index,
	},

	Route{
		"UsersUserIdTodosGet",
		strings.ToUpper("Get"),
		"/users/{userId}/todos",
		UsersUserIdTodosGet,
	},

	Route{
		"UsersUserIdTodosIdDelete",
		strings.ToUpper("Delete"),
		"/users/{userId}/todos/{id}",
		UsersUserIdTodosIdDelete,
	},

	Route{
		"UsersUserIdTodosIdGet",
		strings.ToUpper("Get"),
		"/users/{userId}/todos/{id}",
		UsersUserIdTodosIdGet,
	},

	Route{
		"UsersUserIdTodosIdPut",
		strings.ToUpper("Put"),
		"/users/{userId}/todos/{id}",
		UsersUserIdTodosIdPut,
	},

	Route{
		"UsersUserIdTodosPost",
		strings.ToUpper("Post"),
		"/users/{userId}/todos",
		UsersUserIdTodosPost,
	},
}
