import type { ExperimentMeta } from '../../types';

export const meta = {
	slug: 'multiclass-classification',
	title: 'Multi-Class Classification with Classical ML',
	autors: ['Allan Golding Dwyre'],

	reading_time: 5,

	project_duration: '2 semaines',
	started_date: new Date('2025-02-01'),
	group_type: 'Solo',

	categories: ['Models', 'Data'],
	tech_stack: ['Scikit-learn', 'Python', 'Matplotlib', 'Seaborn'],

	favorite: false,
	excerpt:
		'Comparing Decision Trees, Random Forest, KNN and SVM on a multi-class problem, with hyperparameter tuning via GridSearchCV.',

	github_link: '',
	demo_link: ''
} satisfies ExperimentMeta;
