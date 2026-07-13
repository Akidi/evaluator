<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LineChart from './line-chart.svelte';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'Components/Molecules/Charts/LineChart',
		component: LineChart,
		tags: ['autodocs']
	});

	const parabola = Array.from({ length: 20 }, (_, i) => ({ x: i, y: i * i }));
	const seriesA = Array.from({ length: 20 }, (_, i) => ({ x: i, y: i * 2 }));
	const seriesB = Array.from({ length: 20 }, (_, i) => ({ x: i, y: 40 - i }));
</script>

<!-- Visual stories -->
<Story name="Single series (area)" asChild>
	<LineChart series={[{ name: 'y', points: parabola }]} fillArea xLabel="x" />
</Story>

<Story name="Multi series" asChild>
	<LineChart
		series={[
			{ name: 'hp', points: seriesA },
			{ name: 'mp', points: seriesB }
		]}
	/>
</Story>

<Story name="Empty" asChild>
	<LineChart series={[]} />
</Story>

<!-- Tests -->
<Story
	name="Renders an svg path for data"
	asChild
	play={async ({ canvasElement }) => {
		const paths = canvasElement.querySelectorAll('path.line');
		expect(paths.length).toBe(1);
		expect(paths[0].getAttribute('d')?.startsWith('M')).toBe(true);
	}}
>
	<LineChart series={[{ name: 'y', points: parabola }]} />
</Story>
