<script>
	import { goto } from "$app/navigation";
	import { AuthService } from "$lib/app/services/auth";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { user } from "$lib/app/stores/user";
	import { Toast } from "$lib/app/utils/swal";
	import Rejection from "$lib/components/single/users/alumni/Rejection.svelte";
	import VerificationTopBar from "$lib/components/single/users/alumni/VerificationTopBar.svelte";
	import { ChevronLeft } from "lucide-svelte";
	import { onMount } from "svelte";

	let status = $state(null);
	let rejectionsReady = $state(false);
    let rejections = $state([]);
	let message = $state("");

	async function onFetchRejectionAppeals() {
        await AlumniService.getRejectionAppeals(
            $user,
            async (data, status) => {
                rejectionsReady = true;
                rejections = data;
            },
            async (data, status) => {
                rejectionsReady = true;

                await Toast.fire({
                    title: data?.message ?? "Failed to get rejections.",
                    icon: "error"
                });
            },
        );
    }

	async function onAppealSend(rejection_id) {
		if (message.trim().length === 0) {
            Toast.fire({
                title: "Please write an appeal first.",
                icon: "error"
            });
            return;
        }

        await AlumniService.writeRejectionAppeal(
            { message, rejection_id },
            async (data, status) => {
                await onFetchRejectionAppeals();
                await Toast.fire({
                    title: data?.message ?? "Your appeal was sent.",
                    icon: "success"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to create an appeal.",
                    icon: "error"
                });
            },
        )
    }

	onMount(async () => {
		status = $user.profile.ver_stat_dean;
		await onFetchRejectionAppeals();
	})
</script>

<div class="w-screen h-screen relative space-y-6">
	<VerificationTopBar />
	<div class="flex flex-col items-center justify-center px-6 md:px-96 pb-6">
		<div class="min-h-[calc(100dvh-120px)] max-h-[calc(100dvh-120px)] w-full space-y-4">
			<div class="w-full space-y-2 h-16 flex items-start gap-x-4">
				<button
					title="Home"
					onclick={() => goto("/users/alumni")}
					class="mt-1 text-gray-500 cursor-pointer"
				>
					<ChevronLeft/>
				</button>
				<div>
					<h1 class="font-bold text-2xl">Verification Center</h1>
					<h1 class="text-gray-500">View verification status and rejection history.</h1>
				</div>
			</div>
			<div class="border border-gray-200 bg-white rounded-lg max-h-[calc(100dvh-200px)] p-6 relative space-y-4">
				<div class="w-full sticky top-0 left-0 bg-white">
					<div class="w-full flex items-center justify-between mb-1">
						<div class="flex items-center gap-x-2">
							<h1>Status:</h1>
							{#if status === "Pending"}
								<span class="px-3 py-1 rounded bg-orange-500 text-white">{status}</span>
							{:else if status === "Verified"}
								<span class="px-3 py-1 rounded bg-blue-500 text-white">{status}</span>
							{:else}
								<span class="px-3 py-1 rounded bg-red-500 text-white">{status}</span>
							{/if}
						</div>
					</div>
					{#if status === "Pending"}
						<span>Please wait while the dean is reviewing your account.</span>
					{:else if status === "Verified"}
						<span>Your account is now verified by the dean.</span>
					{:else}
						<span>Remember to write an appeal then comply if your status has been marked as pending.</span>
					{/if}
				</div>
				{#if status !== "Verified"}
					{#if rejectionsReady && rejections.length > 0}
						{#each rejections as rejection}
							<Rejection
								bind:message={message}
								{rejection}
								{onAppealSend}
							/>
						{/each}
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>