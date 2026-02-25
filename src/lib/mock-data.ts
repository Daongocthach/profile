import type { Profile, Project } from "@/lib/types";

export const mockProfile: Profile = {
    id: "1",
    name: "Đào Ngọc Thạch",
    role: "FrontEnd Developer",
    description:
        "Passionate FrontEnd Developer with hands-on experience building cross-platform mobile apps and modern web applications. Skilled in the React ecosystem, from React JS and Next.js for web to React Native for mobile. Experienced with cloud services like Supabase and Firebase to deliver scalable, real-time solutions.",
    location: "Vietnam",
    github_url: "https://github.com/Daongocthach",
    linkedin_url: "https://www.linkedin.com/in/daongocthach",
    email: "thachdn@finepro.net",
    avatar_url: "/images/avatar.jpg",
    skills: [
        "React JS",
        "React Native",
        "Next.js",
        "Supabase",
        "Firebase",
        "Node.js",
    ],
    updated_at: "2026-02-25T00:00:00.000Z",
};

export const mockProjects: Project[] = [
    {
        id: "1",
        name: "Fineprojects",
        description:
            "A comprehensive corporate project management application designed to track project progress, assign tasks, and manage resources efficiently. It features an intuitive interface and a seamless user experience across mobile platforms.",
        project_url: 'https://apps.apple.com/vn/app/fineprojects/id6749673116?l=vi',
        github_url: null,
        image_url:
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/9a/bf/aa/9abfaadd-4982-9bcc-a9e9-210f9fac3cfe/personal.png/400x800bb.png",
        screenshots: [
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/9a/bf/aa/9abfaadd-4982-9bcc-a9e9-210f9fac3cfe/personal.png/400x800bb.png",
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/97/6f/23/976f233c-e2d5-55be-5d4e-e41f4f95ae72/my-projects.png/400x800bb.png",
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/5d/15/df/5d15df87-050d-bd7e-22bf-85101c360969/overview.png/400x800bb.png",
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/ba/22/50/ba225035-141c-6c4e-8eff-359a696395c0/my-tasks.png/400x800bb.png",
        ],
        technologies: ["React Native", "Supabase", "Firebase"],
        sort_order: 1,
        created_at: "2026-01-01T00:00:00.000Z",
    },
    {
        id: "2",
        name: "Finetag",
        description:
            "An NFC-based scanning application for machinery maintenance, enabling technicians to quickly access maintenance history, update equipment status, and record maintenance logs directly on-site.",
        project_url: null,
        github_url: null,
        image_url:
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/50/ee/e7/50eee737-0948-dc6f-f3e1-8cd5172a6042/2.png/400x800bb.png",
        screenshots: [
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/50/ee/e7/50eee737-0948-dc6f-f3e1-8cd5172a6042/2.png/400x800bb.png",
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/42/5d/84/425d8415-fdf7-d102-6d68-8235d83a146b/5.png/400x800bb.png",
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/da/64/71/da6471a9-d9ed-b36b-cc87-07c599ef3800/3.png/400x800bb.png",
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/6f/90/82/6f90829a-1634-c9cb-4365-9e5a5b8fa909/4.png/400x800bb.png",
        ],
        technologies: ["React Native", "NFC", "Firebase"],
        sort_order: 2,
        created_at: "2026-01-15T00:00:00.000Z",
    },
    {
        id: "3",
        name: "Finepro Automation Website",
        description:
            "The official landing page for Finepro Automation, showcasing industrial automation products and solutions. The website is built with a modern, responsive interface and is fully optimized for SEO.",
        project_url: "https://www.finepro.net/products",
        github_url: null,
        image_url: null,
        screenshots: [
            'https://res.cloudinary.com/dalhc6zvg/image/upload/v1772033356/A%CC%89nh_ma%CC%80n_hi%CC%80nh_2026-02-25_lu%CC%81c_22.04.56_mdqdzj.png',
            'https://res.cloudinary.com/dalhc6zvg/image/upload/v1772033353/A%CC%89nh_ma%CC%80n_hi%CC%80nh_2026-02-25_lu%CC%81c_22.06.15_d2cj2z.png',
            'https://res.cloudinary.com/dalhc6zvg/image/upload/v1772033352/A%CC%89nh_ma%CC%80n_hi%CC%80nh_2026-02-25_lu%CC%81c_22.06.05_xvrdvd.png'
        ],
        technologies: ["Next.js", "React JS", "Supabase"],
        sort_order: 3,
        created_at: "2026-02-01T00:00:00.000Z",
    },
];