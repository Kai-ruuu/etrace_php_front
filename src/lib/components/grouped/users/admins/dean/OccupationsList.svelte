<script>
	import { BookX, Eye, Globe, Link, Plus, Search, Unlink } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import Button from "$lib/components/single/global/Button.svelte";

    let {
        query = $bindable(""),
        courseId = $bindable(0),
        courses,
        aligned = $bindable(true),
        occupationsInfo,
        onSearch,
        onAlign,
        onUnalign,
        onNext,
        onPrev,
        onQueryClear,
    } = $props();

    function onWebSearch(occupation) {
        const params = new URLSearchParams({
            q: `Is ${occupation.occupation} aligned to the course ${courses?.[courseId]?.name}?`
        });

        window.open(`https://www.google.com/search?${params.toString()}`);
    }
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
	<HeadBar title="Manage Occupations Alignment"/>
	<div class="max-h-[calc(100%-64px)] overflow-auto">
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
                    <select
                        bind:value={aligned}
                        onchange={onSearch}
                        class="border rounded-lg py-3 border-gray-300"
                    >
                        <option value={true}>Aligned</option>
                        <option value={false}>Not Aligned</option>
                    </select>
                    <TextField
                        bind:value={query}
                        placeholder="Search occupations",
                        btnLabel="Search"
                        BtnIcon={Search}
                        btnOnclick={onSearch}
                        allowClear={true}
                        onClear={onQueryClear}
                        class="grow"
                    />
                </div>
                {#if occupationsInfo.data.length > 0}
                    <div class="px-6">
                        <table>
                            <thead>
                                <tr>
                                    <th class="text-left py-2">Occupation</th>
                                    <th class="pl-4 text-left py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each occupationsInfo.data as occupation}
                                    <tr>
                                        <td class="py-2 text-nowrap">{occupation.occupation}</td>
                                        <td class="pl-4 flex items-center gap-x-2">
                                            <Button
                                                title={aligned ? "Unalign occupation to course" : "Align occupation to couse."}
                                                Icon={aligned ? Unlink : Link}
                                                size="s"
                                                class={aligned ? "bg-red-500" : "bg-green-500"}
                                                onclick={async () => {
                                                    if (aligned) {
                                                        await onUnalign(occupation);
                                                    } else {
                                                        await onAlign(occupation);
                                                    }
                                                }}
                                            />
                                            {#if !aligned}
                                                <Button
                                                    title="Search for alignment on web."
                                                    Icon={Search}
                                                    size="s"
                                                    class="bg-blue-500"
                                                    onclick={() => onWebSearch(occupation)}
                                                />
                                            {/if}
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
                            <span>There are no {aligned ? "aligned" : "not aligned"} occupations to course.</span>
                        {/if}
                    </div>
                {/if}
                <ListPageController info={occupationsInfo} {onPrev} {onNext}/>
            </div>
        </div>
	</div>
</div>