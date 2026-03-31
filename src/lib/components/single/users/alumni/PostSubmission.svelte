<script>
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { Check, ExternalLink, Trash } from "lucide-svelte";
	import Button from "../../global/Button.svelte";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { twMerge } from "tailwind-merge";
	import { onMount } from "svelte";
	import JobPostModal from "$lib/components/grouped/users/alumni/JobPostModal.svelte";

    let { post, onUnsubmit } = $props();
    let postModalOpen = $state(false);
</script>

<div class="border border-gray-200 rounded-lg p-6">
    <div class="w-full flex items-center justify-between gap-x-4">
        <div class="grow flex items-center justify-between">
            <div class="flex items-center gap-x-2">
                <div
                    style="background-image: url({API_BASE_URL + `/uploads/company/logo/${post.company.req_logo}`})"
                    class="min-w-12 min-h-12 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
                ></div>
                <div class="flex flex-col">
                    <h1 class="font-bold text-gray-600 text-sm">{post.company.name}</h1>
                    <button
                        onclick={() => postModalOpen = true}
                        class="flex items-center gap-x-2 text-blue-500 cursor-pointer"
                    >
                        <p class="text-lg">{post.job_post.position}</p>
                        <ExternalLink class="min-w-4 max-w-4"/>
                    </button>
                </div>
            </div>
            <p class="text-gray-600 text-sm">{new Date(post.created_at.split(" ")[0]).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            })}</p>
        </div>
        <Button
            Icon={post.status === "Pending" ? Trash : Check}
            disabled={post.status !== "Pending"}
            onclick={async () => await onUnsubmit(post.job_post.id)}
            size="s"
            class={twMerge("bg-red-500", post.status !== "Pending" && "bg-transparent text-gray-700")}
        />
    </div>
</div>

{#if postModalOpen}
    <JobPostModal jobPost={post} onExit={() => postModalOpen = false}/>
{/if}