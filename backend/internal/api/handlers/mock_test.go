package handlers

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
)

// baseMockQuerier provides stub implementations for all db.Querier methods
// that aren't being tested. Tests can embed this and override specific methods.
type baseMockQuerier struct{}

var _ db.Querier = (*baseMockQuerier)(nil)
// Stub implementations for methods not used in projects/posts handlers
func (m *baseMockQuerier) CountEvents(ctx context.Context) (int64, error) { return 0, nil }
func (m *baseMockQuerier) CountViewsByPath(ctx context.Context, path string) (int64, error) {
	return 0, nil
}
func (m *baseMockQuerier) CreateEvent(ctx context.Context, arg db.CreateEventParams) error {
	return nil
}
func (m *baseMockQuerier) CreateLog(ctx context.Context, arg db.CreateLogParams) (db.Log, error) {
	return db.Log{}, nil
}
func (m *baseMockQuerier) CreatePageView(ctx context.Context, arg db.CreatePageViewParams) error {
	return nil
}
func (m *baseMockQuerier) CreateSession(ctx context.Context, arg db.CreateSessionParams) (db.Session, error) {
	return db.Session{}, nil
}
func (m *baseMockQuerier) CreateUser(ctx context.Context, arg db.CreateUserParams) (db.User, error) {
	return db.User{}, nil
}
func (m *baseMockQuerier) CreateUserWithPassword(ctx context.Context, arg db.CreateUserWithPasswordParams) (db.User, error) {
	return db.User{}, nil
}
func (m *baseMockQuerier) DeleteLog(ctx context.Context, id int32) error       { return nil }
func (m *baseMockQuerier) DeleteSession(ctx context.Context, id uuid.UUID) error { return nil }
func (m *baseMockQuerier) DeleteUser(ctx context.Context, id int32) error        { return nil }
func (m *baseMockQuerier) ExpireSession(ctx context.Context, id uuid.UUID) error { return nil }
func (m *baseMockQuerier) GetEventsByName(ctx context.Context, arg db.GetEventsByNameParams) ([]db.Event, error) {
	return nil, nil
}
func (m *baseMockQuerier) GetEventsCountByNameLastNDays(ctx context.Context, dollar_1 sql.NullString) ([]db.GetEventsCountByNameLastNDaysRow, error) {
	return nil, nil
}
func (m *baseMockQuerier) GetLogByID(ctx context.Context, id int32) (db.Log, error) {
	return db.Log{}, nil
}
func (m *baseMockQuerier) GetSessionByID(ctx context.Context, id uuid.UUID) (db.Session, error) {
	return db.Session{}, nil
}
func (m *baseMockQuerier) GetTotalEventsLastNDays(ctx context.Context, dollar_1 sql.NullString) (int64, error) {
	return 0, nil
}
func (m *baseMockQuerier) GetTotalViewsLastNDays(ctx context.Context, dollar_1 sql.NullString) (int64, error) {
	return 0, nil
}
func (m *baseMockQuerier) GetUserByEmail(ctx context.Context, email string) (db.User, error) {
	return db.User{}, nil
}
func (m *baseMockQuerier) GetUserByID(ctx context.Context, id int32) (db.User, error) {
	return db.User{}, nil
}
func (m *baseMockQuerier) GetUserByUsername(ctx context.Context, username string) (db.User, error) {
	return db.User{}, nil
}
func (m *baseMockQuerier) GetUserForAuth(ctx context.Context, username string) (db.User, error) {
	return db.User{}, nil
}
func (m *baseMockQuerier) GetValidSession(ctx context.Context, id uuid.UUID) (db.Session, error) {
	return db.Session{}, nil
}
func (m *baseMockQuerier) GetViewsByPath(ctx context.Context, arg db.GetViewsByPathParams) ([]db.PageView, error) {
	return nil, nil
}
func (m *baseMockQuerier) GetViewsCountByPathLastNDays(ctx context.Context, dollar_1 sql.NullString) ([]db.GetViewsCountByPathLastNDaysRow, error) {
	return nil, nil
}
func (m *baseMockQuerier) ListEvents(ctx context.Context, arg db.ListEventsParams) ([]db.Event, error) {
	return nil, nil
}
func (m *baseMockQuerier) ListLogs(ctx context.Context, arg db.ListLogsParams) ([]db.Log, error) {
	return nil, nil
}
func (m *baseMockQuerier) ListSessionsByUser(ctx context.Context, userID sql.NullInt32) ([]db.Session, error) {
	return nil, nil
}
func (m *baseMockQuerier) ListUsers(ctx context.Context, arg db.ListUsersParams) ([]db.User, error) {
	return nil, nil
}
func (m *baseMockQuerier) PatchUser(ctx context.Context, arg db.PatchUserParams) (db.User, error) {
	return db.User{}, nil
}

// Stub implementations for projects methods
func (m *baseMockQuerier) ListProjects(ctx context.Context) ([]db.Project, error) {
	return nil, nil
}
func (m *baseMockQuerier) GetProjectBySlug(ctx context.Context, slug string) (db.Project, error) {
	return db.Project{}, nil
}
func (m *baseMockQuerier) CreateProject(ctx context.Context, arg db.CreateProjectParams) (db.Project, error) {
	return db.Project{}, nil
}
func (m *baseMockQuerier) UpdateProject(ctx context.Context, arg db.UpdateProjectParams) (db.Project, error) {
	return db.Project{}, nil
}
func (m *baseMockQuerier) DeleteProject(ctx context.Context, id int32) error {
	return nil
}

// Stub implementations for posts methods
func (m *baseMockQuerier) ListPosts(ctx context.Context, arg db.ListPostsParams) ([]db.Post, error) {
	return nil, nil
}
func (m *baseMockQuerier) GetPostBySlug(ctx context.Context, slug string) (db.Post, error) {
	return db.Post{}, nil
}
func (m *baseMockQuerier) CreatePost(ctx context.Context, arg db.CreatePostParams) (db.Post, error) {
	return db.Post{}, nil
}
func (m *baseMockQuerier) UpdatePost(ctx context.Context, arg db.UpdatePostParams) (db.Post, error) {
	return db.Post{}, nil
}
func (m *baseMockQuerier) DeletePost(ctx context.Context, id int32) error {
	return nil
}
