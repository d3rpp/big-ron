/* eslint-disable no-use-before-define */
export interface User {
    id: number;
    name: string;
    url: string;
    description: string;
    link: string;
    slug: string;
    avatar_urls: AvatarUrls;
    meta: any[];
    yoast_head: string;
    yoast_head_json: YoastHeadJson;
    _links: Links;
}

export interface AvatarUrls {
    '24': string;
    '48': string;
    '96': string;
}

export interface YoastHeadJson {
    title: string;
    robots: Robots;
    canonical: string;
    og_locale: string;
    og_type: string;
    og_title: string;
    og_url: string;
    og_site_name: string;
    og_image: OgImage[];
    twitter_card: string;
    twitter_site: string;
    schema: Schema;
}

export interface Robots {
    index: string;
    follow: string;
    'max-snippet': string;
    'max-image-preview': string;
    'max-video-preview': string;
}

export interface OgImage {
    url: string;
}

export interface Schema {
    '@context': string;
    '@graph': Graph[];
}

export interface Graph {
    '@type': any;
    '@id': string;
    url?: string;
    name?: string;
    description?: string;
    publisher?: Publisher;
    potentialAction?: PotentialAction[];
    inLanguage?: string;
    isPartOf?: IsPartOf;
    breadcrumb?: Breadcrumb;
    itemListElement?: ItemListElement[];
    image?: Image;
    logo?: Logo;
    sameAs?: string[];
    mainEntityOfPage?: MainEntityOfPage;
}

export interface Publisher {
    '@id': string;
}

export interface PotentialAction {
    '@type': string;
    target: any;
    'query-input'?: string;
}

export interface IsPartOf {
    '@id': string;
}

export interface Breadcrumb {
    '@id': string;
}

export interface ItemListElement {
    '@type': string;
    position: number;
    name: string;
    item?: string;
}

export interface Image {
    '@type': string;
    inLanguage: string;
    '@id': string;
    url: string;
    contentUrl: string;
    width: number;
    height: number;
    caption: string;
}

export interface Logo {
    '@id': string;
}

export interface MainEntityOfPage {
    '@id': string;
}

export interface Links {
    self: Self[];
    collection: Collection[];
}

export interface Self {
    href: string;
}

export interface Collection {
    href: string;
}
