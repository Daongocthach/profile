export interface Project {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    project_url: string | null;
    github_url: string | null;
    image_url: string | null;
    screenshots: string[];
    technologies: string[] | null;
    sort_order: number;
    created_at: string;
    // New fields for detail page
    type?: string;
    role?: string;
    duration?: string;
    team_size?: string;
    launched?: string;
    stats?: { label: string; value: string }[];
    features?: string[];
    challenge?: string;
    solution?: string;
}

export interface Profile {
    id: string;
    name: string;
    role: string | null;
    description: string | null;
    location: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    email: string | null;
    avatar_url: string | null;
    skills: string[] | null;
    updated_at: string;
}
