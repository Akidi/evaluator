import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import SelectTestWrapper from './select.test-wrapper.svelte';

describe('Select', () => {
	test('initial value is reflected as the selected option', async () => {
		const { container } = render(SelectTestWrapper, {
			props: {
				initialValue: 'salad'
			}
		});

		const selectElement = container.querySelector('select') as HTMLSelectElement;
		const boundValueElement = container.querySelector('[data-testid="bound-value"]') as HTMLElement;
		expect(selectElement.value).toBe('salad');
		expect(boundValueElement.textContent).toBe('salad');
	});

	test('selecting a different option updates the bound value', async () => {
		const { container } = render(SelectTestWrapper, {
			props: {
				initialValue: 'pasta'
			}
		});

		const selectElement = container.querySelector('select') as HTMLSelectElement;
		const boundValueElement = container.querySelector('[data-testid="bound-value"]') as HTMLElement;

		// Use user event to change the select value
		await userEvent.selectOptions(selectElement, 'salad');

		// Verify the select element reflects the change and that bind:value synced it back to component state
		expect(selectElement.value).toBe('salad');
		expect(boundValueElement.textContent).toBe('salad');
	});
});
