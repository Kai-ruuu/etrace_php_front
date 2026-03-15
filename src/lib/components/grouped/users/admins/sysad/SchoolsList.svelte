<script>
	import { Archive, ArchiveRestore, BookX, Pen, Plus, Search } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import Button from "$lib/components/single/global/Button.svelte";

    let {
        query = $bindable(""),
        archived,
        schoolsInfo,
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
	<HeadBar
        title="Manage Schools"
        BtnIcon={archived ? null : Plus}
        btnLabel={archived ? null : "Add"}
        onBtnClick={archived ? null : onAdd}
    />
	<div class="h-[calc(100%-64px)] overflow-auto">
        <div class="px-6 min-w-max">
            <div class="border border-gray-200 rounded-lg bg-white space-y-2 overflow-clip my-6">
                <div class="sticky top-0 left-0 px-6 bg-white pt-6">
                    <TextField
                        bind:value={query}
                        placeholder="Search schools",
                        btnLabel="Search"
                        BtnIcon={Search}
                        btnOnclick={onSearch}
                        allowClear={true}
                        onClear={onQueryClear}
                    />
                </div>
                {#if schoolsInfo.data.length > 0}
                    <div class="px-6">
                        <table>
                            <thead>
                                <tr>
                                    <th class="text-left py-2">Name</th>
                                    <th class="pl-4 text-left py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each schoolsInfo.data as school}
                                    <tr>
                                        <td class="py-2 text-nowrap">{school.name}</td>
                                        <td class="pl-4 flex items-center gap-x-2">
                                            {#if !archived}
                                                <Button
                                                    Icon={Pen}
                                                    size="s"
                                                    class="bg-blue-500"
                                                    onclick={() => onEdit(school)}
                                                />
                                            {/if}
                                            <Button
                                                Icon={archived ? ArchiveRestore : Archive}
                                                size="s"
                                                class={archived ? "bg-green-500" : "bg-red-500"}
                                                onclick={async () => {
                                                    if (archived) {
                                                        await onRestore(school);
                                                    } else {
                                                        await onArchive(school);
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
                            <span>There are no {archived ? "archived" : "active"} schools.</span>
                        {/if}
                    </div>
                {/if}
                <ListPageController info={schoolsInfo} {onPrev} {onNext}/>
            </div>
        </div>
	</div>
</div>