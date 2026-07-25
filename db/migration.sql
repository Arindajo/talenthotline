CREATE TYPE user_role AS ENUM ('talent', 'recruiter', 'admin');
CREATE TYPE media_type AS ENUM ('video', 'audio');
CREATE TYPE talent_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    contestant_number VARCHAR(10) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'talent',
    password_hash VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE talents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    media_type media_type NOT NULL,
    status talent_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recruiter_categories (
    recruiter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (recruiter_id, category_id)
);

-- Seed default categories
INSERT INTO categories (name, description) VALUES
    ('Music', 'Musical performances and vocal talent'),
    ('Comedy', 'Stand-up comedy and comedic performances'),
    ('Dance', 'Dance performances and choreography'),
    ('Drama', 'Acting and dramatic performances'),
    ('Poetry', 'Spoken word and poetry performances'),
    ('Fashion', 'Fashion design and modeling'),
    ('Visual Art', 'Painting, drawing, and visual creations');
