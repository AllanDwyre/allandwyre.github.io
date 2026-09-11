// Seules categories valides, partagees entre experiments et articles.
// `as const` + `typeof` donne un type litteral : impossible d'assigner une
// categorie hors de cette liste (fini les fautes de frappe genre
// "Deployement" ou "Model" qui creaient une categorie fantome).
export const CATEGORIES = ['Data', 'Deployment', 'Impact Study', 'Models', 'Monitoring'] as const;

export type Category = (typeof CATEGORIES)[number];

export interface ExperimentMeta {
	slug: string;
	title: string;
	autors: string[];

	reading_time: number // in minutes

	project_duration: string;
	started_date: Date;
	group_type: "Solo" | "Group" | "Teams";


	categories: Category[];
	tech_stack: string[];

	favorite: boolean;
	/** Courte description affichée dans la liste, avant d'ouvrir le post */
	excerpt?: string;


	github_link: string;
	demo_link: string;
}


export interface ArticleMeta {
	slug: string;
	title: string;
	autors: string[];

	reading_time: number // in minutes
	category: Category;
	favorite: boolean;

	creation_date: Date;
	link: string;
}
