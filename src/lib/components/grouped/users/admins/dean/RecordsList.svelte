<script>
	import { Archive, ArchiveRestore, BookX, Eye, Pen, Plus, Search, X } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import Button from "$lib/components/single/global/Button.svelte";

    let {
        query = $bindable(""),
        courseId = $bindable(0),
        recordOpen = $bindable(false),
        onRecordOpen,
        courses,
        archived,
        recordsInfo,
        onSearch,
        onArchive,
        onRestore,
        onAdd,
        onNext,
        onPrev,
        onQueryClear,
    } = $props();
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
    <HeadBar title="Manage Graduate Records"/>
	<div class="h-[calc(100%-64px)] overflow-auto">
        <div class="px-6 min-w-max">
            <div class="border border-gray-200 rounded-lg bg-white space-y-2 overflow-clip my-6">
                <div class="sticky top-0 left-0 px-6 bg-white pt-6 flex items-center gap-x-2">
                    <select
                        bind:value={courseId}
                        onchange={onSearch}
                        class="border rounded-lg py-3 border-gray-300"
                    >
                        {#each courses as course}
                            <option value={course.id}>{course.name}</option>
                        {/each}
                    </select>
                    <TextField
                        bind:value={query}
                        placeholder="Search graduate records",
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
                {#if recordsInfo.data.length > 0}
                    <div class="px-6">
                        <table>
                            <thead>
                                <tr>
                                    <th class="text-left py-2">Filename</th>
                                    <th class="text-left pl-4 py-2">Graduation Year</th>
                                    <th class="text-left pl-4 py-2">From</th>
                                    <th class="pl-4 text-left py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each recordsInfo.data as record}
                                    <tr>
                                        <td class="py-2 text-nowrap">{record.filename}</td>
                                        <td class="py-2 pl-4 text-nowrap">{record.graduation_year}</td>
                                        <td class="py-2 pl-4 text-nowrap">{record.uploader.first_name} {record.uploader.middle_name ? record.uploader.middle_name + " " : ""}{record.uploader.last_name}</td>
                                        <td class="pl-4 flex items-center gap-x-2">
                                            {#if !archived}
                                                <Button
                                                    title="View record."
                                                    Icon={Eye}
                                                    size="s"
                                                    class="bg-blue-500"
                                                    onclick={() => onRecordOpen(record)}
                                                />
                                            {/if}
                                            <Button
                                                title={archived ? "Restore record." : "Archive record."}
                                                Icon={archived ? ArchiveRestore : Archive}
                                                size="s"
                                                class={archived ? "bg-green-500" : "bg-red-500"}
                                                onclick={async () => {
                                                    if (archived) {
                                                        await onRestore(record);
                                                    } else {
                                                        await onArchive(record);
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
                            <span>There are no {archived ? "archived" : "active"} records.</span>
                        {/if}
                    </div>
                {/if}
                <ListPageController info={recordsInfo} {onPrev} {onNext}/>
            </div>
        </div>
	</div>
</div>