CREATE TABLE users (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	email VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	image_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	content TEXT NOT NULL,
	from_user VARCHAR(50) NOT NULL,
	to_user VARCHAR(50) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


