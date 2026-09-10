// Miroir des breakpoints de src/styles/_variables.scss ($breakpoint-sm/-md).
// A garder synchronise si ces valeurs SCSS changent.
const PHONE_MAX_WIDTH = 639;
const TABLET_MAX_WIDTH = 899;

export type DeviceMode = 'phone' | 'tablet' | 'desktop';

// Etat reactif (Svelte 5 runes) qui suit le mode d'affichage courant via
// matchMedia. A utiliser dans un composant : `const device = createDeviceMode()`
// puis lire `device.current`.
export function createDeviceMode() {
	let mode = $state<DeviceMode>('desktop');

	$effect(() => {
		const phoneQuery = window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`);
		const tabletQuery = window.matchMedia(`(max-width: ${TABLET_MAX_WIDTH}px)`);

		const update = () => {
			mode = phoneQuery.matches ? 'phone' : tabletQuery.matches ? 'tablet' : 'desktop';
		};

		update();
		phoneQuery.addEventListener('change', update);
		tabletQuery.addEventListener('change', update);

		return () => {
			phoneQuery.removeEventListener('change', update);
			tabletQuery.removeEventListener('change', update);
		};
	});

	return {
		get current() {
			return mode;
		}
	};
}
