import type { ExperimentMeta } from '../../types';

export const meta = {
	slug: 'clip-model',
	title: 'Building a CLIP Model from Scratch',
	autors: ['Allan Golding Dwyre', 'Rammal Farah'],

	reading_time: 7,

	project_duration: '1 mois',
	started_date: new Date('2025-05-01'),
	group_type: 'Group',

	categories: ['Models', 'Data'],
	tech_stack: ['TensorFlow', 'Keras', 'ResNet50', 'Python'],

	favorite: true,
	excerpt:
		'After a CNN and a smallBERT classifier both hit a wall, we built a CLIP model from scratch to search images by caption and captions by image on a 4-class dataset.',

	github_link: 'https://github.com/AllanDwyre/CLIP_Image_Texte/blob/main/projetClip.ipynb',
	demo_link: ''
} satisfies ExperimentMeta;
