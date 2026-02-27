<script>
	import '../../layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import BaseContainer from '$lib/components/single/global/BaseContainer.svelte';
	import Sidebar from '$lib/components/grouped/users/Sidebar.svelte';
	import HeadBar from '$lib/components/grouped/users/admins/HeadBar.svelte';
	import { user } from '$lib/app/stores/user';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { UserService } from '$lib/app/services/users/user';

	let { children } = $props();

	onMount(async () => await UserService.me(
		async (data, status) => user.set(data),
		async (data, status) => {
			if (status === 401) {
				goto("/");
			}
		}
	));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $user}
	<BaseContainer class="flex items-stretch">
		<Sidebar />
		<div class="grow max-h-screen">
			{@render children()}
		</div>
	</BaseContainer>
{:else}
	<p>Loading...</p>
{/if}