export interface ExperimentMeta {
	slug: string;
	title: string;
	autors: string[];

	reading_time: number // in minutes

	project_duration: string;
	started_date: Date;
	group_type: "Solo" | "Group" | "Teams";


	categories: string[];
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
	category: string;
	favorite: boolean;

	creation_date: Date;
	link: string;
}
