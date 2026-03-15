<script>
	import { twMerge } from "tailwind-merge";
	import HeadBar from "../admins/HeadBar.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import { BadgeCheck, BookX, Plus, Search } from "lucide-svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import JobPostModal from "./JobPostModal.svelte";
	import { CompanyService } from "$lib/app/services/users/company";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import Post from "./Post.svelte";
	import { user } from "$lib/app/stores/user";
	import { Toast } from "$lib/app/utils/swal";

    let {
        query = $bindable(""),
        published = $bindable(true),
        postsInfo = $bindable(null),
        onSearch,
        onNext,
        onPrev,
        onQueryClear,
    } = $props();

    let newPostOpen = $state(false);

    function onOpenNewPost() {
        newPostOpen = true;
    }

    function onExitNewPost() {
        newPostOpen = false;
    }

    async function onClosePost(postId) {
        await CompanyService.closeJobPost(postId,
            async (data, status) => {
                postsInfo.data = postsInfo.data.filter((p) => p.id !== postId);

                Toast.fire({
                    title: "Job post closed.",
                    icon: "error"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to close job post.",
                    icon: "error"
                });
            },
        );
    }

    async function onDeletePost(postId) {
        await CompanyService.deleteJobPost(postId,
            async (data, status) => {
                postsInfo.data = postsInfo.data.filter((p) => p.id !== postId);

                Toast.fire({
                    title: "Job post deleted.",
                    icon: "error"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to delete job post.",
                    icon: "error"
                });
            },
        );
    }

    async function onRepost(postId, open_until) {
        await CompanyService.repostJobPost(postId, open_until,
            async (data, status) => {
                postsInfo.data = postsInfo.data.filter((p) => p.id !== postId);

                Toast.fire({
                    title: "Reposted.",
                    icon: "success"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to repost job.",
                    icon: "error"
                });
            },
        );
    }
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
    <HeadBar
        title="Manage Job Posts"
    />
    <div class="h-[calc(100%-64px)] overflow-auto">
        {#if $user.profile.ver_stat_sysad === "Verified" && $user.profile.ver_stat_pstaff === "Verified"}
            <div class="px-6 w-full">
                <div class="border border-gray-200 rounded-lg bg-white space-y-2 overflow-clip my-6">
                    <div class="sticky top-0 left-0 px-6 py-4 bg-white flex items-center gap-x-2">
                        <select
                            bind:value={published}
                            onchange={onSearch}
                            class="border rounded-lg py-3 border-gray-300"
                        >
                            <option value={true}>Open</option>
                            <option value={false}>Closed</option>
                        </select>
                        <TextField
                            bind:value={query}
                            placeholder="Search job posts",
                            btnLabel="Search"
                            BtnIcon={Search}
                            btnOnclick={onSearch}
                            allowClear={true}
                            onClear={onQueryClear}
                            class="grow"
                        />
                        {#if published}
                            <Button
                                Icon={Plus}
                                label="New Post"
                                onclick={onOpenNewPost}
                                class="bg-green-500"
                            />
                        {/if}
                    </div>
                    {#if postsInfo.data.length > 0}
                        <div class="w-full space-y-6 mb-6">
                            {#each postsInfo.data as post}
                                <Post
                                    {post}
                                    {published}
                                    onClose={onClosePost}
                                    onDelete={onDeletePost}
                                    {onRepost}
                                />
                            {/each}
                        </div>
                    {:else}
                        <div class="p-6 pt-4 flex items-center gap-x-2">
                            <BookX class="w-5"/>
                            {#if query.length > 0}
                                <span>No results.</span>
                            {:else}
                                <span>There are no {published ? "open" : "closed"} posts.</span>
                            {/if}
                        </div>
                    {/if}
                    <ListPageController info={postsInfo} {onPrev} {onNext}/>
                </div>
            </div>
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <div class="w-1/3 flex flex-col items-center gap-y-4">
                    <span class="text-center">
                        Cannot manage job posts yet. <br> Your account needs to be fully verified first.
                    </span>
                    <a
                        href="/users/company/verification"
                        class="flex itemc-center gap-x-2 px-5 py-3 text-white bg-blue-500 rounded-lg"
                    >
                        <BadgeCheck class="w-5"/>
                        <span>Verification Center</span>
                    </a>
                </div>
            </div>
        {/if}
    </div>
</div>

{#if newPostOpen}
    <JobPostModal
        {onSearch}
        onExit={onExitNewPost}
    />
{/if}