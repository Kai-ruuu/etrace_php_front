<script>
	import { BadgeCheck, BookX, CircleMinus, CirclePlus, Minus, Plus, Power, PowerOff, RotateCw, Scale, Search, UserCheck, UserSearch, X } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import { twMerge } from "tailwind-merge";

    let {
        query = $bindable(""),
        enabled = $bindable(true),
        verStatus = $bindable("Approved"),
        courseId = $bindable(0),
        alumniInfo,
        courses,
        onSearch,
        onNext,
        onPrev,
        onProfileView,
        onVerify,
        onReject,
        onQueryClear,
        onViewRejections,
    } = $props();
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
	<HeadBar title="Verify Alumni"/>
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
                        placeholder="Search alumni",
                        btnLabel="Search"
                        BtnIcon={Search}
                        btnOnclick={onSearch}
                        allowClear={true}
                        onClear={onQueryClear}
                        class="grow"
                    />
                </div>
                {#if alumniInfo.data.length > 0}
                    <div class="px-6">
                        <table>
                            <thead>
                                <tr>
                                    <th class="text-left py-2">Name</th>
                                    <th class="text-left pl-4 py-2">Email</th>
                                    <th class="text-left pl-4 py-2">Year Graduated</th>
                                    <th class="text-left pl-4 py-2">Gender</th>
                                    <th class="text-left pl-4 py-2">Birth Date</th>
                                    <th class="text-left pl-4 py-2">Phone Number</th>
                                    <th class="text-left pl-4 py-2">Employment Status</th>
                                    <th class="pl-4 text-left py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each alumniInfo.data as alumni}
                                    <tr>
                                        <td class="py-2 text-nowrap">
                                            {alumni.profile.first_name}{alumni.profile.name_extension && (" " + alumni.profile.name_extension)}
                                            {alumni.profile.middle_name && (" " + alumni.profile.middle_name + " ")}
                                            {alumni.profile.last_name}
                                        </td>
                                        <td class="py-2 pl-4 text-nowrap">{alumni.email}</td>
                                        <td class="py-2 pl-4 text-nowrap">{alumni.profile.graduation_year}</td>
                                        <td class="py-2 pl-4 text-nowrap">{alumni.profile.gender}</td>
                                        <td class="py-2 pl-4 text-nowrap">{alumni.profile.birth_date}</td>
                                        <td class="py-2 pl-4 text-nowrap">{alumni.profile.phone_number}</td>
                                        <td class="py-2 pl-4 text-nowrap">{alumni.profile.employment_status}</td>
                                        <td class="pl-4 flex items-center gap-x-2">
                                            <Button
                                                title="View Profile"
                                                Icon={UserSearch}
                                                size="s"
                                                class="bg-blue-500"
                                                onclick={() => onProfileView(alumni)}
                                            />
                                            {#if verStatus === "Pending"}
                                                <Button
                                                    title="Verify"
                                                    Icon={BadgeCheck}
                                                    size="s"
                                                    class="bg-green-500"
                                                    onclick={() => onVerify(alumni)}
                                                />
                                                <Button
                                                    title="Reject"
                                                    Icon={X}
                                                    size="s"
                                                    class="bg-red-500"
                                                    onclick={() => onReject(alumni)}
                                                />
                                            {/if}
                                            {#if verStatus === "Rejected"}
                                                <Button
                                                    title="View Appeals"
                                                    Icon={Scale}
                                                    size="s"
                                                    class="bg-orange-500"
                                                    onclick={async () => await onViewRejections(alumni)}
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
                            <span>There are no {enabled ? "enabled" : "disabled"} alumni.</span>
                        {/if}
                    </div>
                {/if}
                <ListPageController info={alumniInfo} {onPrev} {onNext}/>
            </div>
        </div>
	</div>
</div>