package utils

import (
	"testing"
)

func TestAnonymizeIP(t *testing.T) {
	tests := []struct {
		name       string
		ip         string
		expected   string // for exact match
		expectHash bool   // for hash validation
	}{
		{
			name:     "IPv4 address",
			ip:       "192.168.1.123",
			expected: "192.168.1.0",
		},
		{
			name:     "IPv4 address with different octets",
			ip:       "10.0.5.42",
			expected: "10.0.5.0",
		},
		{
			name: "IPv6 address should be masked",
			ip:   "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
			// Should keep the /48 prefix and mask the rest
		},
		{
			name:       "Invalid IP should be hashed",
			ip:         "not-an-ip",
			expectHash: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := AnonymizeIP(tt.ip)

			// For IPv4, check the expected value
			if tt.expected != "" {
				if result != tt.expected {
					t.Errorf("AnonymizeIP(%s) = %s; want %s", tt.ip, result, tt.expected)
				}
			}

			// For IPv6 and invalid IPs, just check that we get a non-empty result
			if result == "" {
				t.Errorf("AnonymizeIP(%s) returned empty string", tt.ip)
			}

			// For invalid IPs, should return a hash (64 hex chars)
			if tt.expectHash && len(result) != 64 {
				t.Errorf("AnonymizeIP(%s) should return a hash of length 64, got %d", tt.ip, len(result))
			}
		})
	}
}

func TestHashIP(t *testing.T) {
	tests := []struct {
		name string
		ip   string
	}{
		{"IPv4", "192.168.1.1"},
		{"IPv6", "2001:0db8:85a3::8a2e:0370:7334"},
		{"Invalid", "not-an-ip"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			hash := HashIP(tt.ip)

			// Hash should be 64 characters (SHA256 in hex)
			if len(hash) != 64 {
				t.Errorf("HashIP(%s) returned hash of length %d; want 64", tt.ip, len(hash))
			}

			// Hash should be consistent
			hash2 := HashIP(tt.ip)
			if hash != hash2 {
				t.Errorf("HashIP(%s) not consistent: %s != %s", tt.ip, hash, hash2)
			}
		})
	}
}
