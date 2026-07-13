<!--
  @component LineChart

  Token-driven inline-SVG line chart. One series renders as a curve with an
  optional area fill; multiple series render as distinct colored lines with a
  legend. Responsive via viewBox; no external dependencies.

  Categorical colors: this design system's `--primary`/`--secondary` ramps are
  deliberately desaturated (never clear a chart-safe chroma floor) and
  `--success`/`--warning`/`--error` are reserved for status, so the only two
  tokens validated as safe, distinct categorical series colors are
  `--accent-600` and `--info` (see dataviz skill; validated with
  scripts/validate_palette.js in both light and dark modes). Series beyond two
  cycle through this 2-color set — pass an explicit `color` per series to avoid
  repeats when plotting 3+ series.

  @prop series    - One or more { name, points: {x,y}[], color? }.
  @prop height    - CSS height of the plot. Default: '11rem'.
  @prop showAxes  - Render baseline + left axis and min/max tick labels. Default: true.
  @prop fillArea  - Area fill under the first series (best for single-series). Default: false.
  @prop xLabel/yLabel - Optional axis captions.
-->
<script lang="ts">
	import { computeBounds, toPath, toAreaPath, type Point } from './line-chart.util';

	interface Series {
		name: string;
		points: Point[];
		color?: string;
	}
	interface Props {
		series: Series[];
		height?: string;
		showAxes?: boolean;
		fillArea?: boolean;
		xLabel?: string;
		yLabel?: string;
	}

	let {
		series,
		height = '11rem',
		showAxes = true,
		fillArea = false,
		xLabel,
		yLabel
	}: Props = $props();

	// Fixed internal viewBox; SVG scales to the container via width/height.
	const W = 320;
	const H = 160;
	const PAD = 6;

	// Categorical palette, fixed order, validated (dataviz skill six checks) in
	// both light and dark modes against this design system's tokens. Only two
	// slots exist today because --primary/--secondary never clear the chroma
	// floor and --success/--warning/--error are reserved for status.
	const PALETTE = ['var(--accent-600)', 'var(--info)'];

	let bounds = $derived(computeBounds(series.map((s) => s.points)));
	let hasData = $derived(series.some((s) => s.points.length > 0));
	let multi = $derived(series.length > 1);

	function colorFor(s: Series, i: number): string {
		return s.color ?? PALETTE[i % PALETTE.length];
	}
</script>

<figure data-component="line-chart" style="--chart-height: {height}">
	{#if hasData}
		<svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" role="img" aria-label={yLabel ?? 'chart'}>
			{#if showAxes}
				<line class="axis" x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} />
				<line class="axis" x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} />
			{/if}
			{#if fillArea && series[0]}
				<path
					class="area"
					d={toAreaPath(series[0].points, bounds, W, H, PAD)}
					style="--series-color: {colorFor(series[0], 0)}"
				/>
			{/if}
			{#each series as s, i (s.name)}
				<path
					class="line"
					d={toPath(s.points, bounds, W, H, PAD)}
					style="--series-color: {colorFor(s, i)}"
				/>
			{/each}
		</svg>
		{#if showAxes}
			<div class="ticks">
				<span>{bounds.minY.toLocaleString()}</span>
				<span>{bounds.maxY.toLocaleString()}</span>
			</div>
		{/if}
		{#if multi}
			<ul class="legend">
				{#each series as s, i (s.name)}
					<li><span class="swatch" style="background: {colorFor(s, i)}"></span>{s.name}</li>
				{/each}
			</ul>
		{/if}
		{#if xLabel}<figcaption>{xLabel}</figcaption>{/if}
	{:else}
		<p class="empty">No data to plot yet.</p>
	{/if}
</figure>

<style>
	[data-component='line-chart'] {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	[data-component='line-chart'] svg {
		width: 100%;
		height: var(--chart-height, 11rem);
		display: block;
		overflow: visible;
	}
	.axis {
		stroke: var(--border);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	.line {
		fill: none;
		stroke: var(--series-color, var(--accent-600));
		stroke-width: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
		transition: d var(--duration-fast, 150ms) var(--ease-default, ease);
	}
	.area {
		fill: var(--series-color, var(--accent-600));
		opacity: 0.12;
		stroke: none;
	}
	.ticks {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-xs);
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		list-style: none;
		padding: 0;
		font-size: var(--text-xs);
		color: var(--text-muted);
	}
	.legend li {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
	}
	.swatch {
		width: 0.75rem;
		height: 0.25rem;
		border-radius: var(--radius-full, 999px);
	}
	figcaption {
		font-size: var(--text-xs);
		color: var(--text-faint);
		text-align: center;
	}
	.empty {
		font-size: var(--text-sm);
		color: var(--text-faint);
		padding: var(--space-4);
		text-align: center;
	}
</style>
