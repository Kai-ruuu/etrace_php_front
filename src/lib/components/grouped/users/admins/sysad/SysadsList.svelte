<script>
	import { BookX, CircleMinus, CirclePlus, Minus, Plus, Power, PowerOff, RotateCw, Search } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import Button from "$lib/components/single/global/Button.svelte";

    let {
        query = $bindable(""),
        enabled = $bindable(true),
        sysadsInfo,
        onSearch,
        onDisable,
        onEnable,
        onAdd,
        onNext,
        onPrev,
        onQueryClear,
    } = $props();
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
	<HeadBar
        title="Manage System Administrators"
        BtnIcon={enabled ? Plus : null}
        btnLabel={enabled ? "Add" : null}
        onBtnClick={enabled ? onAdd : null}
    />
	<div class="max-h-[calc(100%-64px)] overflow-auto">
        <div class="px-6 min-w-max">
            <div class="border border-gray-200 rounded-lg bg-white space-y-2 overflow-clip my-6">
                <div class="sticky top-0 left-0 px-6 bg-white pt-6 flex items-center gap-x-2">
                    <select
                        bind:value={enabled}
                        onchange={onSearch}
                        class="border rounded-lg py-3 border-gray-300"
                    >
                        <option value={true}>Enabled</option>
                        <option value={false}>Disabled</option>
                    </select>
                    <TextField
                        bind:value={query}
                        placeholder="Search system administrators",
                        btnLabel="Search"
                        BtnIcon={Search}
                        btnOnclick={onSearch}
                        allowClear={true}
                        onClear={onQueryClear}
                        class="grow"
                    />
                </div>
                {#if sysadsInfo.data.length > 0}
                    <div class="px-6">
                        <table>
                            <thead>
                                <tr>
                                    <th class="text-left py-2">Name</th>
                                    <th class="pl-4 text-left py-2">Email</th>
                                    <th class="pl-4 text-left py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each sysadsInfo.data as sysad}
                                    <tr>
                                        <td class="py-2 text-nowrap">{`${sysad.profile.first_name} ${sysad.profile.middle_name ? sysad.profile.middle_name + " " : ""}${sysad.profile.last_name}`}</td>
                                        <td class="pl-4 py-2 text-nowrap">{sysad.email}</td>
                                        <td class="pl-4 flex items-center gap-x-2">
                                            {#if !sysad.default_sysad}
                                                <Button
                                                    Icon={enabled ? PowerOff : Power}
                                                    size="s"
                                                    class={enabled ? "bg-red-500" : "bg-green-500"}
                                                    onclick={async () => {
                                                        if (enabled) {
                                                            await onDisable(sysad);
                                                        } else {
                                                            await onEnable(sysad);
                                                        }
                                                    }}
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
                            <span>There are no {enabled ? "enabled" : "disabled"} system administrators.</span>
                        {/if}
                    </div>
                {/if}
                <ListPageController info={sysadsInfo} {onPrev} {onNext}/>
            </div>
        </div>
	</div>
</div>