export enum ArticleType {
    GUIDE = "Guide",
    TROUBLESHOOT = "Troubleshooting",
    FAQ = "FAQ"
}

export interface Article {
    type: ArticleType,
    name: string
}