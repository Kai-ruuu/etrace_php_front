<script>
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { user } from "$lib/app/stores/user";
	import Button from "$lib/components/single/global/Button.svelte";
	import { Book, Briefcase, Calendar1, Check, ChevronDown, ChevronRight, DollarSign, EllipsisVertical, File, MapPin, MinusCircle, Monitor, Scroll, Share, SunMoon, ThumbsUp, Trash, Users, X } from "lucide-svelte";
	import SubmissionsListModal from "./SubmissionsListModal.svelte";
	import { twMerge } from "tailwind-merge";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import RepostModal from "./RepostModal.svelte";

    let {
        post,
        published,
        onClose,
        onDelete,
        onRepost
    } = $props();
    let collapsed = $state(false);
    let submissionsOpen = $state(false);
    let moreOpen = $state(false);
    let confirmCloseOpen = $state(false);
    let confirmDeleteOpen = $state(false);
    let repostModalOpen = $state(false);
    let openUntil = $state(null);
</script>

<div class="px-6 py-4 rounded-lg border border-gray-200 mx-6 space-y-4">
    <div class="w-full flex justify-between">
        <div class="grow flex items-center gap-x-2">
            <div
                style="background-image: url({API_BASE_URL + `/uploads/company/logo/${$user.profile.req_logo}`})"
                class="min-w-12 min-h-12 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
            ></div>
            <div class="flex flex-col">
                <h1 class="font-bold text-lg">{$user.profile.name}</h1>
                <p class="text-gray-600 text-sm">{new Date(post.created_at.split(" ")[0]).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                })}</p>
            </div>
        </div>
        <div class="flex items-center gap-x-2">
            <div class="relative flex items-center justify-center">
                <button
                    class="cursor-pointer"
                    onclick={() => moreOpen = !moreOpen}
                >
                    <EllipsisVertical class="min-w-4 max-w-4"/>
                </button>
                {#if moreOpen}
                    <div class="absolute top-0 left-0 -translate-x-[100%] border border-gray-200 rounded-lg bg-white">
                        <button
                            disabled={!published}
                            title="Close job post"
                            onclick={() => confirmCloseOpen = true}
                            class={twMerge("text-nowrap flex items-center gap-x-2 pl-4 pr-5 py-2 cursor-pointer", !published && "text-gray-300")}
                        >
                            <MinusCircle class="min-w-4 max-w-4"/>
                            <span>Close</span>
                        </button>
                        <hr class="border-t border-gray-200">
                        <button
                            disabled={published}
                            title="Delete job post"
                            onclick={() => confirmDeleteOpen = true}
                            class={twMerge("text-nowrap flex items-center gap-x-2 pl-4 pr-5 py-2 cursor-pointer text-red-500", published && "text-red-300")}
                        >
                            <Trash class="min-w-4 max-w-4"/>
                            <span>Delete</span>
                        </button>
                        <hr class="border-t border-gray-200">
                        <button
                            disabled={published}
                            title="Repost job"
                            onclick={() => {
                                repostModalOpen = true;
                                const now = new Date();
                                now.setDate(now.getDate() + 30);
                                const in30Days = now.toISOString().split('T')[0];
                                openUntil = in30Days;
                            }}
                            class={twMerge("text-nowrap flex items-center gap-x-2 pl-4 pr-5 py-2 cursor-pointer", published && "text-gray-300")}
                        >
                            <Share class="min-w-4 max-w-4"/>
                            <span>Repost</span>
                        </button>
                        <hr class="border-t border-gray-200">
                        <button
                            title="Cancel"
                            onclick={() => moreOpen = false}
                            class="text-nowrap flex items-center gap-x-2 pl-4 pr-5 py-2 cursor-pointer"
                        >
                            <X class="min-w-4 max-w-4"/>
                            <span>Cancel</span>
                        </button>
                    </div>
                {/if}
            </div>
            <button
                class="cursor-pointer"
                onclick={() => collapsed = !collapsed}
            >
                {#if collapsed}
                    <ChevronDown class="min-w-4 max-w-4"/>
                {:else}
                    <ChevronRight class="min-w-4 max-w-4"/>
                {/if}
            </button>
        </div>
    </div>

    <hr class="border-t border-gray-200">
    
    <!-- header -->
    <div class="w-full">
        <h1 class="flex items-center gap-x-2">
            <Briefcase class="min-w-4 max-w-4"/>
            <strong>{post.position}</strong>
        </h1>
        <div class="flex items-center gap-x-2">
            <Calendar1 class="min-w-4 max-w-4"/>
            <span>Until {new Date(post.open_until).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            })}</span>
        </div>
        <div class="flex items-center gap-x-2">
            <Users class="min-w-4 max-w-4"/>
            <span>{post.slots} vacancies</span>
        </div>
        <div class="flex items-center gap-x-2">
            <DollarSign class="min-w-4 max-w-4"/>
            <span>₱{post.salary_min} - ₱{post.salary_max}</span>
        </div>
    </div>

    <p class="text-justify">{post.description}</p>

    {#if collapsed}
        <div class="w-full pt-2">
            <p class="p-0 mb-2 text-gray-500">Qualifications:</p>
            <div class="w-full space-y-1">
                {#each JSON.parse(post.qualifications) as quali}
                    <div class="flex items-center gap-x-2">
                        <Check class="min-w-4 max-w-4"/>
                        <p>{quali}</p>
                    </div>
                {/each}
            </div>
        </div>

        <div class="w-full pt-2">
            <p class="p-0 mb-2 text-gray-500">Work Information:</p>
            <div class="w-full space-y-1">
                <div class="flex items-center gap-x-2">
                    <MapPin class="min-w-4 max-w-4"/>
                    <span>Address: {post.address}</span>
                </div>
                <div class="flex items-center gap-x-2">
                    <Scroll class="min-w-4 max-w-4"/>
                    <span>Employment Type: {post.employment_type}</span>
                </div>
                <div class="flex items-center gap-x-2">
                    <SunMoon class="min-w-4 max-w-4"/>
                    <span>Shift: {post.work_shift}</span>
                </div>
                <div class="flex items-center gap-x-2">
                    <Monitor class="min-w-4 max-w-4"/>
                    <span>Setup: {post.work_setup}</span>
                </div>
            </div>
        </div>

        {#if post.additional_info}
            <div class="w-full pt-2">
                <p class="p-0 mb-2 text-gray-500">Additional Information:</p>
                <p class="text-justify">{post.additional_info}</p>
            </div>
        {/if}

        <div class="w-full pt-2">
            <p class="p-0 mb-2 text-gray-500">Target Courses:</p>
            {#each post.target_courses as course}
                <div class="flex items-center gap-x-2">
                    <Book class="min-w-4 max-w-4"/>
                    <span>{course.course_name}</span>
                </div>
            {/each}
        </div>
    {/if}
    
    {#if published}
        <hr class="border-t border-gray-200">
        <div class="w-full flex justify-end">
            <div class="flex items-center gap-x-4">
                <button
                    onclick={() => {}}
                    class="flex items-center gap-x-2 border-r border-gray-300 pr-4 cursor-pointer"
                >
                    <ThumbsUp class="min-w-4 max-w-4"/>
                    <span>{post.likes} {post.likes === 1 ? "Like" : "Likes"}</span>
                </button>
                <div class="flex items-center gap-x-2 pr-4">
                    <File class="min-w-4 max-w-4"/>
                    <span>{post.submissions} CV {post.submissions === 1 ? "Submission" : "Submissions"}</span>
                </div>
            </div>
            <Button
                Icon={File}
                label="View CV Submissions"
                onclick={() => submissionsOpen = true}
                size="s"
                class="bg-blue-500"
            />
        </div>
    {/if}
</div>

{#if submissionsOpen}
    <SubmissionsListModal
        {post}
        onExit={() => submissionsOpen = false}
    />
{/if}

{#if confirmCloseOpen}
    <ConfirmPopup
        confirmText="Close post?"
        onCancel={() => confirmCloseOpen = false}
        onConfirm={async () => {
            confirmCloseOpen = false;
            await onClose(post.id);
        }}
    />
{/if}

{#if confirmDeleteOpen}
    <ConfirmPopup
        confirmText="Delete post?"
        onCancel={() => confirmDeleteOpen = false}
        onConfirm={async () => {
            confirmDeleteOpen = false;
            await onDelete(post.id);
        }}
    />
{/if}

{#if repostModalOpen}
    <RepostModal
        bind:openUntil={openUntil}
        onCancel={() => {
            moreOpen = false;
            repostModalOpen = false;
            openUntil = null;
        }}
        onConfirm={async () => {
            moreOpen = false;
            repostModalOpen = false;
            await onRepost(post.id, openUntil);
        }}
    />
{/if}