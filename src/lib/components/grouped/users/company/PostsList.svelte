<script>
	import { twMerge } from "tailwind-merge";
	import HeadBar from "../admins/HeadBar.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import { BookX, Plus, Search } from "lucide-svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import JobPostModal from "./JobPostModal.svelte";
	import { CompanyService } from "$lib/app/services/users/company";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import Post from "./Post.svelte";

    let {
        query = $bindable(""),
        published = $bindable(true),
        postsInfo,
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
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
    <HeadBar
        title="Manage Job Posts"
    />
    <div class="max-h-[calc(100%-64px)] overflow-auto">
        <div class="px-6 w-full">
            <div class="border border-gray-200 rounded-lg bg-white space-y-2 overflow-clip my-6">
                <div class="sticky top-0 left-0 px-6 py-4 bg-white flex items-center gap-x-2">
                    <select
                        bind:value={published}
                        onchange={onSearch}
                        class="border rounded-lg py-3 border-gray-300"
                    >
                        <option value={true}>Published</option>
                        <option value={false}>Unpublished</option>
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
                    <Button
                        Icon={Plus}
                        label="New Post"
                        onclick={onOpenNewPost}
                    />
                </div>
                {#if postsInfo.data.length > 0}
                    <div class="w-full space-y-6 mb-6">
                        {#each postsInfo.data as post}
                            <Post {post}/>
                        {/each}
                    </div>
                {:else}
                    <div class="p-6 pt-4 flex items-center gap-x-2">
                        <BookX class="w-5"/>
                        {#if query.length > 0}
                            <span>No results.</span>
                        {:else}
                            <span>There are no {published ? "published" : "unpublished"} posts.</span>
                        {/if}
                    </div>
                {/if}
                <ListPageController info={postsInfo} {onPrev} {onNext}/>
            </div>
        </div>
    </div>
</div>

{#if newPostOpen}
    <JobPostModal
        {onSearch}
        onExit={onExitNewPost}
    />
{/if}