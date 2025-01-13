

BEGIN TRANSACTION;

PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    login TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    icon TEXT NOT NULL,
    automatic_accept NUMERIC NOT NULL,
    location TEXT NOT NULL,
    created_by NUMERIC NOT NULL, 
    created_at NUMERIC NOT NULL, 
    FOREIGN KEY(created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_id INTEGER,
    status INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(event_id) REFERENCES events(id)
);

-- INSERT OR IGNORE INTO users (username, password, email, login)
-- VALUES 
--   ('john_doe', 'password123', 'john.doe@example.com', 'johndoe'),
--   ('jane_smith', 'securepass456', 'jane.smith@example.com', 'janesmith'),
--   ('michael_jones', 'mypassword789', 'michael.jones@example.com', 'michaeljones');

-- INSERT OR IGNORE INTO events (title, date, icon, automatic_accept, location, private, created_by, created_at)
-- VALUES 
--   ('Team Meeting', '2025-01-20', 'bi bi-cake2', 1, 'Office', 0, 1, strftime('%s', 'now')),
--   ('Project Launch', '2025-02-15', 'bi bi-backpack4', 0, 'Online', 1, 2, strftime('%s', 'now')),
--   ('Annual Conference', '2025-03-10', 'bi bi-award', 1, 'Convention Center', 0, 3, strftime('%s', 'now'));

-- INSERT OR IGNORE INTO user_event (user_id, event_id, status)
-- VALUES 
--   (1, 1, 1),  
--   (2, 1, 1),  
--   (3, 2, 0),  
--   (1, 3, 1),  
--   (2, 3, 1); 

COMMIT;
