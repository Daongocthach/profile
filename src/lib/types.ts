export interface Project {
    id: string;
    name: string;
    description: string | null;
    project_url: string | null;
    github_url: string | null;
    image_url: string | null;
    technologies: string[] | null;
    sort_order: number;
    created_at: string;
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
