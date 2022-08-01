export interface ArticlePost {
    author: {
        profile_picture_url: string;
        profile_name: string;
    };

    title: string;
    caption: string;
    url: string;

    thumbnailUrl: string | null;

    date: string;
}

export type Changelog = ArticlePost;
