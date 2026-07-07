<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, userEvent } from 'storybook/test';
  import FileUpload from './file-upload.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Display/FileUpload',
    component: FileUpload,
    tags: ['autodocs'],
  });
</script>

<!-- Visual state previews -->
<Story name="Default — empty" />

<Story name="With hint" args={{ hint: 'Export from your bank and drop it here' }} />

<Story
  name="State — selected"
  args={{
    initialState: 'selected',
    initialFile: new File(['date,amount\n2026-04-01,-10.00'], 'april-transactions.csv', {
      type: 'text/csv',
    }),
  }}
/>

<Story name="State — error" args={{ initialState: 'error' }} />

<Story name="State — drag over" args={{ initialState: 'dragover' }} />

<!-- Interaction tests -->
<Story
  name="Drop zone is a button with aria-label"
  tags={['!autodocs']}
  args={{}}
  play={async ({ canvas }) => {
    const zone = canvas.getByRole('button', { name: /drop your csv/i });
    expect(zone).toBeTruthy();
  }}
/>

<Story
  name="Selecting valid CSV collapses zone to file row"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['date,amount\n2026-04-01,-10.00'], 'april.csv', { type: 'text/csv' });
    await userEvent.upload(input, file);

    expect(canvas.queryByRole('button', { name: /drop your csv/i })).toBeNull();
    expect(canvas.getByText('april.csv')).toBeTruthy();
  }}
/>

<Story
  name="Invalid file type shows error state with aria-invalid"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['data'], 'export.xlsx', { type: 'application/vnd.ms-excel' });
    await userEvent.upload(input, file, { applyAccept: false });

    expect(canvas.getByText(/only csv files are supported/i)).toBeTruthy();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  }}
/>

<Story
  name="Dropping valid CSV on zone selects it"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const zone = canvas.getByRole('button', { name: /drop your csv/i });
    const file = new File(['date,amount'], 'dropped.csv', { type: 'text/csv' });
    const dt = new DataTransfer();
    dt.items.add(file);

    zone.dispatchEvent(new DragEvent('dragover', { bubbles: true, dataTransfer: dt }));
    zone.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }));

    expect(await canvas.findByText('dropped.csv')).toBeTruthy();
  }}
/>

<Story
  name="Error clears when valid file provided after invalid"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(input, new File(['data'], 'bad.pdf', { type: 'application/pdf' }), {
      applyAccept: false,
    });
    expect(input).toHaveAttribute('aria-invalid', 'true');

    await userEvent.upload(input, new File(['date,amount'], 'good.csv', { type: 'text/csv' }));
    expect(canvas.getByText('good.csv')).toBeTruthy();
    expect(canvas.queryByRole('button', { name: /drop your csv/i })).toBeNull();
  }}
/>

<Story
  name="Delete key on focused remove button clears file"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(['date,amount'], 'test.csv', { type: 'text/csv' }));

    const removeBtn = canvas.getByRole('button', { name: /remove test\.csv/i });
    removeBtn.focus();
    await userEvent.keyboard('{Delete}');

    expect(canvas.getByRole('button', { name: /drop your csv/i })).toBeTruthy();
  }}
/>

<Story
  name="Remove button clears file and resets to empty state"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['date,amount'], 'test.csv', { type: 'text/csv' });
    await userEvent.upload(input, file);

    const removeBtn = canvas.getByRole('button', { name: /remove test\.csv/i });
    await userEvent.click(removeBtn);

    expect(canvas.getByRole('button', { name: /drop your csv/i })).toBeTruthy();
    expect(canvas.queryByText('test.csv')).toBeNull();
  }}
/>
