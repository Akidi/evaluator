<script lang="ts">
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import favicon from '#lib/assets/favicon.svg';

	let { children } = $props();

	import '@wildmuse/ui/styles.css';
	import { AppShell, Center, Heading, Stack } from '@wildmuse/ui';
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<AppShell>
	<Stack>
		<Center max="85ch">
			<Heading level={1}> Formulator 9000 </Heading>
		</Center>
		<main>
			{@render children()}
		</main>
	</Stack>
</AppShell>

<div style="display:none">
	{#each locales as locale (locale)}
		<a
			href={resolve(localizeHref(page.url.pathname, { locale }) as Path)}
		>{locale}</a>
	{/each}
</div>
