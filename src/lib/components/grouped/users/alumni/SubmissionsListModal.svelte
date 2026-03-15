<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import { X } from "lucide-svelte";
	import AlumniList from "../admins/dean/AlumniList.svelte";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { Toast } from "$lib/app/utils/swal";
	import { onMount } from "svelte";
	import PostSubmission from "$lib/components/single/users/alumni/PostSubmission.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";

    let {
        onExit,
        jobPosts = $bindable([])
    } = $props();

    let submissionsInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});
    let submissionsReady = $state(false);

    async function getSubmissions() {
        await AlumniService.getCvSubmissions(
            async (data, status) => {
                submissionsInfo = data;
                submissionsReady = true;
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to get cv submissions.",
                    icon: "error"
                });
            },
        );
    }

    async function onUnsubmit(postId) {
        await AlumniService.cancelCvSubmission(postId,
            async (data, status) => {
                submissionsInfo.data = submissionsInfo.data.filter((p) => p.job_post.id !== postId);
                jobPosts = jobPosts.map((p) => {
                    if (p.id === postId) {
                        let pCopy = p;
                        pCopy.submissions--;
                        pCopy.is_submitted = false;
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
		if (submissionsInfo.has_prev) {
			submissionsInfo.page--;
			await getSubmissions();
		}
	}

	async function onNext() {
		if (submissionsInfo.has_next) {
			submissionsInfo.page++;
			await getSubmissions();
		}
	}

    onMount(getSubmissions);
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white gap-y-4 md:w-1/2 relative">
        <div class="flex items-center justify-between mb-4 sticky top-0 left-0 w-full p-6 pb-0">
            <h1 class="text-lg">CV Submissions</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        {#if submissionsReady}
            {#if submissionsInfo.data.length === 0}
                <h1 class="mt-4 px-6 pb-6">You haven't submitted your CV to any posts yet.</h1>
            {:else}
                <div class="space-y-4 mb-4 px-6">
                    {#each submissionsInfo.data as post}
                        <PostSubmission {post} {onUnsubmit}/>
                    {/each}
                </div>
                <ListPageController
                    info={submissionsInfo}
                    {onNext}
                    {onPrev}
                />
            {/if}
        {/if}
    </div>
</div>