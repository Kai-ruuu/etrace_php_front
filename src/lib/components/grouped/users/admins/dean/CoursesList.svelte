<script>
	import { Archive, ArchiveRestore, BookX, Pen, Plus, Search } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import Button from "$lib/components/single/global/Button.svelte";

    let {
        query = $bindable(""),
        archived,
        coursesInfo,
        onSearch,
        onEdit,
        onArchive,
        onRestore,
        onAdd,
        onNext,
        onPrev,
        onQueryClear,
    } = $props();
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
	<HeadBar title="Manage Courses"/>
	<div class="h-[calc(100%-64px)] overflow-auto">
        <div class="px-6 min-w-max">
            <div class="border border-gray-200 rounded-lg bg-white space-y-2 overflow-clip my-6">
                <div class="sticky top-0 left-0 px-6 bg-white pt-6 flex items-center gap-x-2">
                    <TextField
                        bind:value={query}
                        placeholder="Search courses",
                        btnLabel="Search"
                        BtnIcon={Search}
                        btnOnclick={onSearch}
                        allowClear={true}
                        onClear={onQueryClear}
                        class="grow"
                    />
                    {#if !archived}
                        <Button
                            Icon={Plus}
                            label="Add"
                            onclick={onAdd}
                            class="bg-green-500"
                        />
                    {/if}
                </div>
                {#if coursesInfo.data.length > 0}
                    <div class="px-6">
                        <table>
                            <thead>
                                <tr>
                                    <th class="text-left py-2">Name</th>
                                    <th class="text-left pl-4 py-2">Code</th>
                                    <th class="pl-4 text-left py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each coursesInfo.data as course}
                                    <tr>
                                        <td class="py-2 text-nowrap">{course.name}</td>
                                        <td class="py-2 pl-4 text-nowrap">{course.code}</td>
                                        <td class="pl-4 flex items-center gap-x-2">
                                            {#if !archived}
                                                <Button
                                                    title="Edit course information."
                                                    Icon={Pen}
                                                    size="s"
                                                    class="bg-blue-500"
                                                    onclick={() => onEdit(course)}
                                                />
                                            {/if}
                                            <Button
                                                title={archived ? "Restore course." : "Archive course."}
                                                Icon={archived ? ArchiveRestore : Archive}
                                                size="s"
                                                class={archived ? "bg-green-500" : "bg-red-500"}
                                                onclick={async () => {
                                                    if (archived) {
                                                        await onRestore(course);
                                                    } else {
                                                        await onArchive(course);
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {:else}
                    <div class="p-6 pt-4 flex items-center gap-x-2">
                        <BookX class="w-5"/>
                        {#if query.length > 0}
                            <span>No results.</span>
                        {:else}
                            <span>There are no {archived ? "archived" : "active"} courses.</span>
                        {/if}
                    </div>
                {/if}
                <ListPageController info={coursesInfo} {onPrev} {onNext}/>
            </div>
        </div>
	</div>
</div>