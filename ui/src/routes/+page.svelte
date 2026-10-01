<script lang="ts">
	import FormulaRunner from '#lib/FormulaRunner.svelte';
	import FunctionPanel from '#lib/FunctionPanel.svelte';
	import { Playground } from '#lib/playground.svelte.js';
	import VariablePanel from '#lib/VariablePanel.svelte';
	import { TabList, Tab, Tabs, TabPanel } from '@wildmuse/ui';

	const pg = new Playground();
</script>

<FormulaRunner {pg} />

<Tabs defaultValue="custom_fn">
	<TabList>
		<Tab value="custom_fn">Custom Functions</Tab>
		<Tab value="custom_var">Custom Variables</Tab>
		<Tab value="inspector">Inspector</Tab>
	</TabList>
	<TabPanel value="custom_var">
		<VariablePanel {pg} />
	</TabPanel>
	<TabPanel value="custom_fn">
		<FunctionPanel {pg} />
	</TabPanel>
</Tabs>

<style>
</style>
