-- Supabase Database Schema for Portfolio
-- Run these queries in your Supabase SQL editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contact submissions table
CREATE TABLE contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page views tracking
CREATE TABLE page_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page VARCHAR(100) NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    session_id UUID DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project interactions tracking
CREATE TABLE project_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- 'github', 'demo', 'details'
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscribers (optional feature)
CREATE TABLE newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills feedback system
CREATE TABLE skill_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users (for portfolio management)
CREATE TABLE admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live chat messages (optional feature)
CREATE TABLE chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    visitor_name VARCHAR(255),
    visitor_email VARCHAR(255),
    message TEXT NOT NULL,
    is_from_admin BOOLEAN DEFAULT FALSE,
    chat_session_id UUID DEFAULT uuid_generate_v4(),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts (if you want to add a blog section)
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES auth.users(id),
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_submitted_at ON contact_submissions(submitted_at);
CREATE INDEX idx_page_views_page ON page_views(page);
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX idx_page_views_ip ON page_views(ip_address);
CREATE INDEX idx_project_interactions_project ON project_interactions(project_name);
CREATE INDEX idx_project_interactions_clicked_at ON project_interactions(clicked_at);
CREATE INDEX idx_skill_feedback_skill ON skill_feedback(skill_name);
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_chat_messages_session ON chat_messages(chat_session_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at);

-- Create a function to get skill averages
CREATE OR REPLACE FUNCTION get_skill_averages()
RETURNS TABLE(skill_name VARCHAR, average_rating NUMERIC, total_ratings BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sf.skill_name,
        ROUND(AVG(sf.rating), 2) as average_rating,
        COUNT(sf.rating) as total_ratings
    FROM skill_feedback sf
    WHERE sf.is_verified = TRUE
    GROUP BY sf.skill_name
    ORDER BY average_rating DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get visitor statistics
CREATE OR REPLACE FUNCTION get_visitor_stats(days_back INTEGER DEFAULT 30)
RETURNS TABLE(
    total_views BIGINT,
    unique_visitors BIGINT,
    popular_pages JSON,
    recent_countries JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_views,
        COUNT(DISTINCT ip_address) as unique_visitors,
        (
            SELECT JSON_AGG(page_stats)
            FROM (
                SELECT page, COUNT(*) as views
                FROM page_views 
                WHERE viewed_at >= NOW() - INTERVAL '1 day' * days_back
                GROUP BY page
                ORDER BY views DESC
                LIMIT 5
            ) page_stats
        ) as popular_pages,
        '[]'::JSON as recent_countries -- You can integrate with IP geolocation API
    FROM page_views 
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for contact submissions (anyone can insert, only admins can read)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can read contact submissions" ON contact_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Policies for page views (anyone can insert for tracking)
CREATE POLICY "Anyone can track page views" ON page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can read page views" ON page_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Policies for project interactions
CREATE POLICY "Anyone can track project interactions" ON project_interactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can read project interactions" ON project_interactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Policies for skill feedback
CREATE POLICY "Anyone can submit skill feedback" ON skill_feedback
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read verified skill feedback" ON skill_feedback
    FOR SELECT USING (is_verified = true);

CREATE POLICY "Only admins can read all skill feedback" ON skill_feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Policies for newsletter subscribers
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can read newsletter subscribers" ON newsletter_subscribers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Policies for blog posts
CREATE POLICY "Anyone can read published blog posts" ON blog_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Only admins can manage blog posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert your admin user (replace with your actual auth user ID after creating account)
-- INSERT INTO admin_users (user_id, role) VALUES ('your-auth-user-id-here', 'admin');

-- Sample data for testing (optional)
-- INSERT INTO skill_feedback (skill_name, rating, feedback, is_verified) VALUES
-- ('Python', 5, 'Excellent Python skills demonstrated in projects', true),
-- ('Cybersecurity', 5, 'Great security knowledge and implementation', true),
-- ('Docker', 4, 'Good containerization skills', true),
-- ('Nmap', 5, 'Expert level network scanning capabilities', true);
