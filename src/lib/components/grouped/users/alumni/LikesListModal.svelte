<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import { X } from "lucide-svelte";
	import AlumniList from "../admins/dean/AlumniList.svelte";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { Toast } from "$lib/app/utils/swal";
	import { onMount } from "svelte";
	import LikedPost from "$lib/components/single/users/alumni/LikedPost.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";

    let {
        onExit,
        jobPosts = $bindable([])
    } = $props();

    let likedPostsInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});
    let likedPostsReady = $state(false);

    async function getLikedPosts() {
        await AlumniService.getPostLikes(
            async (data, status) => {
                likedPostsInfo = data;
                likedPostsReady = true;
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to get liked posts.",
                    icon: "error"
                });
            },
        );
    }

    async function onDislike(postId) {
        await AlumniService.dislike(postId,
            async (data, status) => {
                likedPostsInfo.data = likedPostsInfo.data.filter((p) => p.job_post.id !== postId);
                jobPosts = jobPosts.map((p) => {
                    if (p.id === postId) {
                        let pCopy = p;
                        pCopy.likes--;
                        pCopy.is_liked = false;
                        return pCopy;
                    } else {
                        return p;
                    }
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to dislike post.",
                    icon: "error"
                });
            },
        );
    }

    async function onPrev() {
		if (likedPostsInfo.has_prev) {
			likedPostsInfo.page--;
			await getLikedPosts();
		}
	}

	async function onNext() {
		if (likedPostsInfo.has_next) {
			likedPostsInfo.page++;
			await getLikedPosts();
		}
	}

    onMount(getLikedPosts);
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white pb-0 gap-y-4 md:w-1/2 relative">
        <div class="flex items-center justify-between mb-4 sticky top-0 left-0 w-full p-6 pb-0">
            <h1 class="text-lg">Liked Posts</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        {#if likedPostsReady}
            {#if likedPostsInfo.data.length === 0}
                <h1 class="mt-4 px-6 pb-6">You haven't liked any posts yet.</h1>
            {:else}
                <div class="space-y-4 mb-4 px-6">
                    {#each likedPostsInfo.data as post}
                        <LikedPost {post} {onDislike}/>
                    {/each}
                </div>
                <ListPageController
                    info={likedPostsInfo}
                    {onNext}
                    {onPrev}
                />
            {/if}
        {/if}
    </div>
</div>