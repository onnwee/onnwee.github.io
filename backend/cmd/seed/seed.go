package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/lib/pq"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"

	"github.com/brianvoe/gofakeit/v6"
)

func getenvInt(key string, fallback int) int {
	if val := os.Getenv(key); val != "" {
		if i, err := strconv.Atoi(val); err == nil {
			return i
		}
	}
	return fallback
}

func getenvDuration(key string, fallback time.Duration) time.Duration {
	if val := os.Getenv(key); val != "" {
		if d, err := time.ParseDuration(val); err == nil {
			return d
		}
	}
	return fallback
}

func main() {
	gofakeit.Seed(0)

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	numUsers := getenvInt("SEED_NUM_USERS", 500)
	numPosts := getenvInt("SEED_NUM_POSTS", 500)
	numProjects := getenvInt("SEED_NUM_PROJECTS", 500)
	delayBetween := getenvDuration("SEED_DELAY", 50*time.Millisecond)

	dbConn, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer dbConn.Close()

	queries := db.New(dbConn)
	ctx := context.Background()

	log.Println("🌱 Seeding users...")
	userIDs := make([]int32, 0, numUsers)
	for i := 0; i < numUsers; i++ {
		name := gofakeit.Username()
		email := gofakeit.Email()
		user, err := queries.CreateUser(ctx, db.CreateUserParams{
			Username: name,
			Email:    email,
		})
		if err != nil {
			log.Printf("CreateUser error: %v", err)
			continue
		}
		userIDs = append(userIDs, user.ID)
		log.Printf("✅ Created user: %s (%s)", name, email)
		time.Sleep(delayBetween)
	}

	log.Println("📝 Seeding posts...")
	for i := 0; i < numPosts; i++ {
		title := gofakeit.Sentence(3)
		slug := strings.ToLower(strings.ReplaceAll(title, " ", "-")) + fmt.Sprintf("-%d", gofakeit.Number(10000, 99999))
		summary := gofakeit.Sentence(10)
		content := gofakeit.Paragraph(3, 5, 10, "\n\n")
		tags := []string{gofakeit.Word(), gofakeit.Word()}
		userID := userIDs[gofakeit.Number(0, len(userIDs)-1)]

		_, err := queries.CreatePost(ctx, db.CreatePostParams{
			Title:   title,
			Slug:    slug,
			Summary: sql.NullString{String: summary, Valid: true},
			Content: content,
			Tags:    tags,
			IsDraft: sql.NullBool{Bool: false, Valid: true},
			UserID:  sql.NullInt32{Int32: userID, Valid: true},
		})
		if err != nil {
			log.Printf("CreatePost error: %v", err)
			continue
		}
		log.Printf("📝 Created post: %s", title)
		time.Sleep(delayBetween)
	}

	log.Println("🚀 Seeding projects...")
	for i := 0; i < numProjects; i++ {
		title := gofakeit.Sentence(3)
		slug := strings.ToLower(strings.ReplaceAll(title, " ", "-")) + fmt.Sprintf("-%d", gofakeit.Number(10000, 99999))
		description := gofakeit.Paragraph(1, 3, 5, " ")
		repoURL := fmt.Sprintf("https://github.com/%s/%s", gofakeit.Username(), slug)
		liveURL := fmt.Sprintf("https://%s.com", slug)
		userID := userIDs[gofakeit.Number(0, len(userIDs)-1)]

		_, err := queries.CreateProject(ctx, db.CreateProjectParams{
			Title:       title,
			Slug:        slug,
			Description: sql.NullString{String: description, Valid: true},
			RepoUrl:     sql.NullString{String: repoURL, Valid: true},
			LiveUrl:     sql.NullString{String: liveURL, Valid: true},
			UserID:      sql.NullInt32{Int32: userID, Valid: true},
		})
		if err != nil {
			log.Printf("CreateProject error: %v", err)
			continue
		}
		log.Printf("🚀 Created project: %s", title)
		time.Sleep(delayBetween)
	}

	log.Println("✅ Database seeding complete.")
}
