<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent } from 'storybook/test';

  const onchangeSpy = fn();
  import Tabs from './tabs.svelte';
  import TabList from './tab-list.svelte';
  import Tab from './tab.svelte';
  import TabPanel from './tab-panel.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Navigation/Tabs',
    component: Tabs,
    tags: ['autodocs'],
  });
</script>

<Story name="Default (uncontrolled)" asChild>
  <Tabs defaultValue="macros">
    <TabList>
      <Tab value="macros">Macros</Tab>
      <Tab value="ingredients">Ingredients</Tab>
      <Tab value="notes">Notes</Tab>
    </TabList>
    <TabPanel value="macros">Protein: 32g · Carbs: 45g · Fat: 12g</TabPanel>
    <TabPanel value="ingredients">Chicken breast, rice, broccoli</TabPanel>
    <TabPanel value="notes">Prep time: 20 min</TabPanel>
  </Tabs>
</Story>

<Story name="With disabled tab" asChild>
  <Tabs defaultValue="macros">
    <TabList>
      <Tab value="macros">Macros</Tab>
      <Tab value="ingredients" disabled>Ingredients</Tab>
      <Tab value="notes">Notes</Tab>
    </TabList>
    <TabPanel value="macros">Macro content</TabPanel>
    <TabPanel value="ingredients">Ingredients content</TabPanel>
    <TabPanel value="notes">Notes content</TabPanel>
  </Tabs>
</Story>

<Story
  name="Active tab panel is visible"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('tabpanel')).toBeVisible();
  }}
  asChild
>
  <Tabs defaultValue="macros">
    <TabList>
      <Tab value="macros">Macros</Tab>
      <Tab value="ingredients">Ingredients</Tab>
    </TabList>
    <TabPanel value="macros">Macro content</TabPanel>
    <TabPanel value="ingredients">Ingredients content</TabPanel>
  </Tabs>
</Story>

<Story
  name="Selected tab has aria-selected=true"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('tab', { name: 'Macros' })).toHaveAttribute('aria-selected', 'true');
    expect(canvas.getByRole('tab', { name: 'Ingredients' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  }}
  asChild
>
  <Tabs defaultValue="macros">
    <TabList>
      <Tab value="macros">Macros</Tab>
      <Tab value="ingredients">Ingredients</Tab>
    </TabList>
    <TabPanel value="macros">Macro content</TabPanel>
    <TabPanel value="ingredients">Ingredients content</TabPanel>
  </Tabs>
</Story>

<Story
  name="Clicking tab switches active panel"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'Ingredients' }));
    expect(canvas.getByText('Ingredients content')).toBeVisible();
  }}
  asChild
>
  <Tabs defaultValue="macros">
    <TabList>
      <Tab value="macros">Macros</Tab>
      <Tab value="ingredients">Ingredients</Tab>
    </TabList>
    <TabPanel value="macros">Macro content</TabPanel>
    <TabPanel value="ingredients">Ingredients content</TabPanel>
  </Tabs>
</Story>

<Story
  name="Controlled: onchange fires with new value"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    onchangeSpy.mockClear();
    await userEvent.click(canvas.getByRole('tab', { name: 'Ingredients' }));
    expect(onchangeSpy).toHaveBeenCalledWith('ingredients');
  }}
  asChild
>
  <Tabs value="macros" onchange={onchangeSpy}>
    <TabList>
      <Tab value="macros">Macros</Tab>
      <Tab value="ingredients">Ingredients</Tab>
    </TabList>
    <TabPanel value="macros">Macro content</TabPanel>
    <TabPanel value="ingredients">Ingredients content</TabPanel>
  </Tabs>
</Story>

<Story
  name="Disabled tab is not activatable"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'Ingredients' }));
    expect(canvas.getByRole('tab', { name: 'Macros' })).toHaveAttribute('aria-selected', 'true');
  }}
  asChild
>
  <Tabs defaultValue="macros">
    <TabList>
      <Tab value="macros">Macros</Tab>
      <Tab value="ingredients" disabled>Ingredients</Tab>
    </TabList>
    <TabPanel value="macros">Macro content</TabPanel>
    <TabPanel value="ingredients">Ingredients content</TabPanel>
  </Tabs>
</Story>
