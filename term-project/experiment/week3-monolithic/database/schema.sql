DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'TODO',
    priority TEXT DEFAULT 'MEDIUM',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, status, priority) VALUES
('Setup Environment', 'Install tools', 'DONE', 'HIGH'),
('Learn Monolithic', 'Study architecture', 'IN_PROGRESS', 'HIGH'),
('Build App', 'Create CRUD', 'TODO', 'MEDIUM');