export function downloadCV(filename = 'Allan-Golding-Dwyre-CV.pdf', url = '/CV_2026_en.pdf') {
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
}