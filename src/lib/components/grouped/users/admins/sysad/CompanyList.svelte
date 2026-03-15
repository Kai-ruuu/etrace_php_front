<script>
	import { BadgeCheck, BookX, CircleMinus, CirclePlus, Minus, Plus, Power, PowerOff, RotateCw, Scale, Search, UserCheck, UserSearch, X } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import { CompanyService } from "$lib/app/services/users/company";

    let {
        query = $bindable(""),
        enabled = $bindable(true),
        verStatus = $bindable("Approved"),
        industry = $bindable("Technology / IT"),
        companiesInfo,
        onSearch,
        onDisable,
        onEnable,
        onProfileView,
        onNext,
        onPrev,
        onVerify,
        onReject,
        onQueryClear,
        onViewRejections
    } = $props();

    const industries = [
        'Technology / IT','Finance / Banking / Insurance','Healthcare / Pharmaceuticals',
        'Education / Research','Manufacturing / Industrial','Retail / E-commerce',
        'Food & Beverage / Hospitality','Transportation / Logistics','Energy / Utilities',
        'Media / Entertainment / Advertising','Government / Public Sector',
        'Real Estate / Construction','Consulting / Professional Services','Nonprofit / NGO',
        'Telecommunications'
    ];
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
	<HeadBar title="Verify Companies"/>
	<div class="h-[calc(100%-64px)] overflow-auto">
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
                    <select
                        bind:value={verStatus}
                        onchange={onSearch}
                        class="border rounded-lg py-3 border-gray-300"
                    >
                        <option value={'Pending'}>Pending</option>
                        <option value={'Verified'}>Verified</option>
                        <option value={'Rejected'}>Rejected</option>
                    </select>
                    <select
                        bind:value={industry}
                        onchange={onSearch}
                        class="border rounded-lg py-3 border-gray-300"
                    >
                        {#each industries as ind}
                            <option value={ind}>{ind}</option>
                        {/each}
                    </select>
                    <TextField
                        bind:value={query}
                        placeholder="Search companies",
                        btnLabel="Search"
                        BtnIcon={Search}
                        btnOnclick={onSearch}
                        allowClear={true}
                        onClear={onQueryClear}
                        class="grow"
                    />
                </div>
                {#if companiesInfo.data.length > 0}
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
                                {#each companiesInfo.data as company}
                                    <tr>
                                        <td class="py-2 text-nowrap">{company.profile.name}</td>
                                        <td class="pl-4 py-2 text-nowrap">{company.email}</td>
                                        <td class="pl-4 flex items-center gap-x-2">
                                            {#if !company.default_company}
                                                <Button
                                                    title={enabled ? "Disable" : "Enable"}
                                                    Icon={enabled ? PowerOff : Power}
                                                    size="s"
                                                    class={enabled ? "bg-red-500" : "bg-green-500"}
                                                    onclick={async () => {
                                                        if (enabled) {
                                                            await onDisable(company);
                                                        } else {
                                                            await onEnable(company);
                                                        }
                                                    }}
                                                />
                                            {/if}
                                            <Button
                                                title="View Profile"
                                                Icon={UserSearch}
                                                size="s"
                                                class="bg-blue-500"
                                                onclick={() => onProfileView(company)}
                                            />
                                            {#if verStatus === "Pending"}
                                                <Button
                                                    title="Verify"
                                                    Icon={BadgeCheck}
                                                    size="s"
                                                    class="bg-green-500"
                                                    onclick={() => onVerify(company)}
                                                />
                                                <Button
                                                    title="Reject"
                                                    Icon={X}
                                                    size="s"
                                                    class="bg-red-500"
                                                    onclick={() => onReject(company)}
                                                />
                                            {/if}
                                            {#if verStatus === "Rejected"}
                                                <Button
                                                    title="View Appeals"
                                                    Icon={Scale}
                                                    size="s"
                                                    class="bg-orange-500"
                                                    onclick={async () => await onViewRejections(company)}
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
                            <span>There are no {enabled ? "enabled" : "disabled"} companies.</span>
                        {/if}
                    </div>
                {/if}
                <ListPageController info={companiesInfo} {onPrev} {onNext}/>
            </div>
        </div>
	</div>
</div>