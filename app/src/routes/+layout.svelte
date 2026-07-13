<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { ThemeToggle } from '$lib/components/molecules';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="theme-toggle-fixed">
	<ThemeToggle />
</div>

{@render children()}

<style>
	.theme-toggle-fixed {
		position: fixed;
		top: var(--space-4);
		right: var(--space-4);
		z-index: var(--z-sticky, 50);
	}
</style>

<div style="display:none">
	{#each locales as locale (locale)}
		<a
			href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}
		>{locale}</a>
	{/each}
</div>
