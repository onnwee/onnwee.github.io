// internal/middleware/ratelimit.go
package middleware

import (
	"net/http"
	"sync"
	"time"
)

type visitor struct {
	lastSeen time.Time
	tokens   int
}

var (
	visitors     = make(map[string]*visitor)
	visitorsLock sync.Mutex
	maxRequests  = 60              // per window
	window       = 1 * time.Minute // window duration
)

func RateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.Header.Get("X-Client-IP")
		if ip == "" {
			ip = r.RemoteAddr
		}

		visitorsLock.Lock()
		v, exists := visitors[ip]
		now := time.Now()

		if !exists || now.Sub(v.lastSeen) > window {
			v = &visitor{tokens: maxRequests - 1, lastSeen: now}
			visitors[ip] = v
		} else {
			if v.tokens <= 0 {
				visitorsLock.Unlock()
				http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
				return
			}
			v.tokens--
			v.lastSeen = now
		}
		visitorsLock.Unlock()

		next.ServeHTTP(w, r)
	})
}
