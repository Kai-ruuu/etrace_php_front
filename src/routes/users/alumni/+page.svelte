<script>
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { settings } from "$lib/app/stores/alumni";
	import { user } from "$lib/app/stores/user";
	import { Toast } from "$lib/app/utils/swal";
	import LikesListModal from "$lib/components/grouped/users/alumni/LikesListModal.svelte";
	import Post from "$lib/components/grouped/users/alumni/Post.svelte";
	import ProfileViewModal from "$lib/components/grouped/users/alumni/ProfileViewModal.svelte";
	import SubmissionsListModal from "$lib/components/grouped/users/alumni/SubmissionsListModal.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import TopBar from "$lib/components/single/users/alumni/TopBar.svelte";
	import { BadgeCheck, Briefcase, ChevronRight, Eye, File, MapPin, Phone, ThumbsUp } from "lucide-svelte";
	import { onMount } from "svelte";

	let query = $state("");
	let jobPostsInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});
	let jobPostsReady = $state(false);
	let loadingMore = $state(false);
	let sentinel = $state(null);
	let likedPostsOpen = $state(false);
	let cvSubmittedPostsOpen = $state(false);

	async function searchJobPosts() {
		jobPostsReady = false;

		await AlumniService.searchJobPosts(query, {
			page: jobPostsInfo.page,
			perPage: jobPostsInfo.per_page,
			onSuccess: async (data, status) => {
				jobPostsReady = true;
				jobPostsInfo = data;
			},
			onFail: async (data, status) => {
				jobPostsReady = true;
				await Toast.fire({
					title: data?.message ?? "Failed to get job posts.",
					icon: "error"
				});
			},
		});
	}

	async function onSearch() {
		jobPostsInfo.page = 1;
		await searchJobPosts();
	}

	async function onQueryClear() {
		query = "";
		jobPostsInfo.page = 1;
		await searchJobPosts();
	}

	async function loadMore() {
		if (loadingMore || !jobPostsInfo.has_next) return;
		loadingMore = true;

		await AlumniService.searchJobPosts(query, {
			page: jobPostsInfo.page + 1,
			perPage: jobPostsInfo.per_page,
			onSuccess: async (data) => {
				jobPostsInfo = {
					...data,
					data: [...jobPostsInfo.data, ...data.data],
				};
			},
			onFail: async () => {
				await Toast.fire({ title: "Failed to load more posts.", icon: "error" });
			},
		});

		await new Promise(r => setTimeout(r, 1000));
		loadingMore = false;
	}

	$effect(() => {
		if (!sentinel) return;
		const observer = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) loadMore(); },
			{ threshold: 0.025 }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	});

	onMount(searchJobPosts);
</script>

<div class="w-screen h-screen relative">
	<TopBar bind:query={query} {onSearch} {onQueryClear}/>
	{#if $user.profile.ver_stat_dean === "Verified"}
		<div class="grid grid-cols-3 px-32 pt-6 gap-x-4">
			<div class="col-span-1 space-y-4">
				<div class="border border-gray-200 space-y-4 rounded-lg p-6 bg-white">
					<div class="flex items-center gap-x-4">
						<div
							style="background-image: url({API_BASE_URL + `/uploads/alumni/profile_picture/${$user.profile.file_profile_picture}`})"
							class="min-w-12 min-h-12 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
						></div>
						<div class="grow flex flex-col">
							<span class="max-w-4/5 truncate font-bold">
								{$user.profile.first_name}{$user.profile.name_extension && (" " + $user.profile.name_extension)}
								{$user.profile.middle_name && ($user.profile.middle_name + " ")}
								{$user.profile.last_name}
							</span>
							<span>{$user.email}</span>
						</div>
					</div>
					<hr class="border-t border-gray-200 mt-6 mb-4">
					<div class="space-y-1">
						<div class="flex items-center gap-x-2">
							<BadgeCheck class="min-w-4 max-w-4"/>
							{#if $user.profile.ver_stat_dean === "Pending"}
								<span class="text-yellow-500">Pending</span>
							{:else if $user.profile.ver_stat_dean === "Verified"}
								<span class="text-blue-500">Verified</span>
							{:else if $user.profile.ver_stat_dean === "Rejected"}
								<span class="text-red-500">Rejected</span>
							{/if}
						</div>
						<div class="flex items-center gap-x-2">
							<Briefcase class="min-w-4 max-w-4"/>
							<span class={$user.profile.employment_status === "Unemployed" ? "text-yellow-500" : "text-green-500"}>{$user.profile.employment_status}</span>
						</div>
						<div class="flex items-center gap-x-2">
							<Phone class="min-w-4 max-w-4"/>
							<span>{$user.profile.phone_number}</span>
						</div>
						<div class="flex items-center gap-x-2">
							<MapPin class="min-w-4 max-w-4"/>
							<span>{$user.profile.address}</span>
						</div>
					</div>
					<Button
						Icon={Eye}
						onclick={() => {
							$settings.open = true;
							$settings.tab = "profile";
						}}
						label="My Profile"
						class="w-full border border-blue-500 text-blue-500 bg-transparent"
					/>
				</div>
				<div class="border border-gray-200 rounded-lg px-6 py-2 bg-white">
					<button
						onclick={() => likedPostsOpen = true}
						class="flex items-center gap-x-2 w-full py-2 cursor-pointer border-b border-gray-200"
					>
						<ThumbsUp class="min-w-4 max-w-4"/>
						<span>Liked Posts</span>
					</button>
					<button
						onclick={() => cvSubmittedPostsOpen = true}
						class="flex items-center gap-x-2 w-full py-2 cursor-pointer"
					>
						<File class="min-w-4 max-w-4"/>
						<span>CV Submissions</span>
					</button>
				</div>
			</div>
			<div class="col-span-2 min-h-[calc(100dvh-96px)] max-h-[calc(100dvh-96px)] overflow-x-hidden overflow-y-auto space-y-4 no-scrollbar">
				{#if jobPostsReady}
					{#if jobPostsInfo.data.length > 0}
						{#each jobPostsInfo.data as post, index}
							<Post bind:post={jobPostsInfo.data[index]}/>
						{/each}
						<div bind:this={sentinel} class="border border-gray-100/0"></div>
						{#if loadingMore}
							<div class="text-center py-4 text-gray-400">Loading more...</div>
						{/if}
					{:else}
						<div>No job posts yet.</div>
					{/if}
				{:else}
					<div>Loading job posts...</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center min-h-[calc(100dvh-96px)] max-h-[calc(100dvh-96px)]">
			<div class="w-1/3 flex flex-col items-center gap-y-4">
				<span class="text-center">
					Cannot view job posts yet. Your account needs to be verified first.
				</span>
				<a
					href="/users/alumni/verification"
					class="flex itemc-center gap-x-2 px-5 py-3 text-white bg-blue-500 rounded-lg"
				>
					<BadgeCheck class="w-5"/>
					<span>Verification Center</span>
				</a>
			</div>
		</div>
	{/if}
</div>

{#if likedPostsOpen}
	<LikesListModal
		bind:jobPosts={jobPostsInfo.data}
		onExit={() => likedPostsOpen = false}
	/>
{/if}
{#if cvSubmittedPostsOpen}
	<SubmissionsListModal
		bind:jobPosts={jobPostsInfo.data}
		onExit={() => cvSubmittedPostsOpen = false}
	/>
{/if}