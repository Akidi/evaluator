import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import TextareaTestWrapper from './textarea.test-wrapper.svelte';

describe('Textarea', () => {
	test('initial value is reflected in the rendered textarea', () => {
		const { container } = render(TextareaTestWrapper, {
			props: { initialValue: 'hello' }
		});

		const textareaElement = container.querySelector('textarea') as HTMLTextAreaElement;
		expect(textareaElement.value).toBe('hello');
	});

	test('typing updates the bound value, not just the DOM element', async () => {
		const { container } = render(TextareaTestWrapper, {
			props: { initialValue: 'hello' }
		});

		const textareaElement = container.querySelector('textarea') as HTMLTextAreaElement;
		const boundValueElement = container.querySelector('[data-testid="bound-value"]') as HTMLElement;

		await userEvent.click(textareaElement);
		await userEvent.keyboard(' world');

		expect(textareaElement.value).toBe('hello world');
		expect(boundValueElement.textContent).toBe('hello world');
	});
});
