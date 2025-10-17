package utils

import (
	"crypto/sha256"
	"encoding/hex"
	"net"
	"strings"
)

// AnonymizeIP anonymizes an IP address by either truncating it or hashing it
// For IPv4: truncates the last octet (e.g., 192.168.1.123 -> 192.168.1.0)
// For IPv6: truncates the last 80 bits (keeps the /48 prefix)
func AnonymizeIP(ipStr string) string {
	ip := net.ParseIP(ipStr)
	if ip == nil {
		// If parsing fails, hash the string
		return HashIP(ipStr)
	}

	// IPv4
	if ip.To4() != nil {
		// Mask the last octet
		parts := strings.Split(ipStr, ".")
		if len(parts) == 4 {
			parts[3] = "0"
			return strings.Join(parts, ".")
		}
	}

	// IPv6
	if ip.To16() != nil {
		// Mask the last 80 bits (keep /48 prefix)
		mask := net.CIDRMask(48, 128)
		masked := ip.Mask(mask)
		return masked.String()
	}

	// Fallback to hashing
	return HashIP(ipStr)
}

// HashIP creates a SHA256 hash of an IP address
// This provides stronger anonymization but is one-way
func HashIP(ipStr string) string {
	hash := sha256.Sum256([]byte(ipStr))
	return hex.EncodeToString(hash[:])
}
