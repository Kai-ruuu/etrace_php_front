<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import { Check, CheckCheck, File, Link, User, X } from "lucide-svelte";
	import AlumniList from "../admins/dean/AlumniList.svelte";
	import { Toast } from "$lib/app/utils/swal";
	import { onMount } from "svelte";
	import PostSubmission from "$lib/components/single/users/alumni/PostSubmission.svelte";
	import { CompanyService } from "$lib/app/services/users/company";
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { twMerge } from "tailwind-merge";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import AlumniProfileModal from "./AlumniProfileModal.svelte";

    let {
        post = $bindable(null),
        onExit
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

    let alumniProfileOpen = $state(false);
    let alumniUserId = $state(null);

    async function getSubmissions() {
        await CompanyService.getCvSubmissions(
            post,
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

    async function onReview(post, index) {
        await CompanyService.reviewSubmission(post.id,
            async (data, status) => {
                submissionsInfo.data[index].status = 'Reviewed';
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to set the submission as reviewed",
                    icon: "error"
                });
            },
        );
    }

    onMount(getSubmissions);
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white p-6 gap-y-4 md:w-2/3 md:max-w-2/3 overflow-x-auto relative min-h-[calc(100dvh-64px)] z-100">
        <div class="flex items-center justify-between mb-4 sticky top-0 left-0 w-full bg-white">
            <h1 class="text-lg">CV Submissions</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        {#if submissionsReady}
            {#if submissionsInfo.data.length === 0}
                <h1 class="mt-4">There are no CV submissions for this post yet.</h1>
            {:else}
                <div class="space-y-4 relative">
                    <table>
                        <thead>
                            <tr>
                                <th class="text-left py-2">Status</th>
                                <th class="text-left pl-4 py-2">Submitted</th>
                                <th class="text-left pl-4 py-2">Name</th>
                                <th class="text-left pl-4 py-2">Course</th>
                                <th class="text-left pl-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each submissionsInfo.data as post, index}
                                <tr class="w-full">
                                    <td class={twMerge("py-2 text-nowrap", post.status === "Pending" ? "text-yellow-500" : "text-green-500")}>{post.status}</td>
                                    <td class="py-2 pl-4 text-nowrap">
                                        {new Date(post.created_at.split(" ")[0]).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </td>
                                    <td class="py-2 pl-4 text-nowrap">
                                        {post.alumni.first_name}{post.alumni.name_extension && (" " + post.alumni.name_extension)}
                                        {post.alumni.middle_name && (" " + post.alumni.middle_name + " ")}
                                        {post.alumni.last_name}
                                    </td>
                                    <td class="py-2 pl-4 text-nowrap">{post.alumni.course}</td>
                                    <td class="py-2 pl-4 pr-6 text-nowrap flex items-center gap-x-2">
                                        <a
                                            class="flex items-center gap-x-2 text-white bg-blue-500 rounded-lg px-3 py-1 text-sm"
                                            href={API_BASE_URL + "/uploads/alumni/cv/" + post.alumni.file_cv}
                                            target="_blank"
                                        >
                                            <File class="min-w-4 max-w-4"/>
                                            <span>View CV</span>
                                        </a>
                                        <Button
                                            Icon={User}
                                            label="View Profile"
                                            size="s"
                                            class="bg-blue-500"
                                            onclick={() => {
                                                alumniUserId = post.alumni.user_id;
                                                alumniProfileOpen = true;
                                            }}
                                        />
                                        {#if post.status === "Reviewed"}
                                            <Button
                                                Icon={CheckCheck}
                                                label="Reviewed"
                                                size="s"
                                                class="bg-transparent text-gray-500"
                                            />
                                        {:else}
                                            <Button
                                                Icon={Check}
                                                label="Set as Reviewed"
                                                size="s"
                                                class="bg-green-500"
                                                onclick={async () => onReview(post, index)}
                                            />
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
            <div class="absolute bottom-0 left-0 w-full">
                <ListPageController
                    info={submissionsInfo}
                    {onNext}
                    {onPrev}
                />
            </div>
        {/if}
    </div>
</div>

{#if alumniProfileOpen}
    <AlumniProfileModal 
        alumniId={alumniUserId}
        onExit={() => {
            alumniUserId = null;
            alumniProfileOpen = false;
        }}
    />
{/if}