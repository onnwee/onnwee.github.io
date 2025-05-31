// internal/middleware/ip.go
package middleware

import (
	"net"
	"net/http"
	"strings"
)

func RealIP(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.Header.Get("X-Forwarded-For")
		if ip == "" {
			ip = r.Header.Get("X-Real-IP")
		}
		if ip == "" {
			ip, _, _ = net.SplitHostPort(r.RemoteAddr)
		} else {
			// Take first IP in case of comma-separated list
			ip = strings.Split(ip, ",")[0]
		}

		r.Header.Set("X-Client-IP", ip)
		next.ServeHTTP(w, r)
	})
}
