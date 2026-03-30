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
	import ConsentModal from '$lib/components/grouped/users/admins/ConsentModal.svelte';
	import { AuthService } from '$lib/app/services/auth';

	let { children } = $props();
	let device = useWidth();
	let openAgreement = $state(false);

	async function onReload() {
		await UserService.me(
			async (data, status) => {
				if (data["role"] !== ROLE.pstaff.value) {
					goto("/bad-request");
				}
				
				if (!data.profile.agreed_to_consent) {
					openAgreement = true;
				}
				
				user.set(data);
			},
			async (data, status) => {
				if (status === 401) {
					goto("/");
				}
			}
		);
	}

	async function onLogout() {
        await AuthService.logout(
            async (data, status) => {
                goto("/");
                await Toast.fire({
                    title: data?.message ?? "Signed out successfully!",
                    icon: "success"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Failed to sign out.",
                    icon: "error"
                });
                goto("/");
            }
        );
    }

	async function onAgree() {
		await UserService.agreeToConsent(
			async (data, status) => {
				await onReload();

				openAgreement = false;

				await Toast.fire({
					title: data?.message ?? "Welcome to E-trace!",
					icon: "success"
				});
			},
			async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Unable to agree.",
					icon: "success"
				});
			},
		)
	}

	onMount(onReload);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $user}
	{#if openAgreement}
		<ConsentModal forRole={"PESO Staff"} {onAgree} onExit={onLogout}/>
	{:else}
		<BaseContainer class="flex items-stretch">
			<Sidebar />
			<div class="grow max-h-screen max-w-[calc(100%-1px)] overflow-auto">
				{@render children()}
			</div>
		</BaseContainer>
	{/if}
{:else}
	<p>Loading...</p>
{/if}