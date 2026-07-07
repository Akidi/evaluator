<!--
  @component UserCard

  Compact identity block showing avatar, name, email, and optional role/badge.
  Avatar falls back to initials derived from `name`.

  @prop name  - Full display name. Used to derive initials. Required.
  @prop email - Email address shown below the name. Required.
  @prop src   - Avatar image URL. Falls back to initials when absent or broken. Default: `undefined`
  @prop role  - Job title or role label. Default: `undefined`
  @prop badge - Optional badge text (e.g. `"Admin"`). Default: `undefined`

  @example Basic
  <UserCard name="Jane Smith" email="jane@example.com" />

  @example With role and badge
  <UserCard name="Jane Smith" email="jane@example.com" role="Baker" badge="Admin" />
-->
<script lang="ts">
  import { Avatar, Badge } from '$lib/components/atoms';
  import { Cluster, Stack } from '$lib/components/layouts';

  interface Props {
    name: string;
    email: string;
    src?: string;
    role?: string;
    badge?: string;
  }

  let { name, email, src, role, badge }: Props = $props();

  const initials = $derived(
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );
</script>

<div data-component="user-card">
  <Cluster align="center" space="var(--space-3)">
    <Avatar {src} alt={name} fallback={initials} />
    <Stack space="var(--space-1)" style="flex: 1; min-width: 0;">
      <Cluster align="center" space="var(--space-2)">
        <span data-user-card-name>{name}</span>
        {#if badge}<Badge>{badge}</Badge>{/if}
      </Cluster>
      {#if role}<span data-user-card-role>{role}</span>{/if}
      <span data-user-card-email>{email}</span>
    </Stack>
  </Cluster>
</div>
