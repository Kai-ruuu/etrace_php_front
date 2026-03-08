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
	import { useWidth } from '$lib/app/hooks/useWidth.svelte';
	import { ROLE } from '$lib/app/core/constants';

	let { children } = $props();
	let device = useWidth();

	onMount(async () => {
		await UserService.me(
			async (data, status) => {
				if (data["role"] !== ROLE.sysad.value) {
					goto("/bad-request");
				}
				
				user.set(data);
			},
			async (data, status) => {
				if (status === 401) {
					goto("/");
				}
			}
		);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $user}
	<BaseContainer class="flex items-stretch">
		<Sidebar />
		{#if device.isMobile}
			<div class="grow max-h-screen max-w-[calc(100%-1px)]">
				{@render children()}
			</div>
		{:else}
			<div class="grow max-h-screen">
				{@render children()}
			</div>
		{/if}
	</BaseContainer>
{:else}
	<p>Loading...</p>
{/if}