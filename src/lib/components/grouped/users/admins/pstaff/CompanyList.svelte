<script>
	import { BadgeCheck, BookX, CircleMinus, CirclePlus, Info, Minus, Plus, Power, PowerOff, RotateCw, Scale, Search, UserCheck, UserSearch, X } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import ApprovalStatusText from "$lib/components/single/users/company/ApprovalStatusText.svelte";

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

    function getApprovedCount(company) {
        const statuses = [
            company.profile.stat_req_company_profile,
            company.profile.stat_req_business_permit,
            company.profile.stat_req_sec,
            company.profile.stat_req_dti_cda,
            company.profile.stat_req_reg_of_est,
            company.profile.stat_req_philjobnet_reg,
            company.profile.stat_req_cert_from_dole,
            company.profile.stat_req_cert_no_case,
            company.profile.stat_req_list_of_vacancies
        ];
        return statuses.filter((s) => s === "Approved").length;
    }
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
	<HeadBar title="Verify Companies"/>
	<div class="h-[calc(100%-64px)] overflow-auto">
        <div class="px-6 min-w-max">
            <div class="border border-gray-200 rounded-lg bg-white space-y-2 my-6">
                <div class="sticky top-0 left-0 px-6 bg-white pt-6 flex items-center gap-x-2 rounded-lg">
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
                                    <th class="pl-4 text-left py-2">Approved Requirements</th>
                                    <th class="pl-4 text-left py-2">Address</th>
                                    <th class="pl-4 text-left py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each companiesInfo.data as company}
                                    <tr>
                                        <td class="py-2 text-nowrap relative">
                                            {company.profile.name}
                                        </td>
                                        <td class="pl-4 py-2 text-nowrap relative">
                                            {company.email}
                                        </td>
                                        <td class="pl-4 py-2 text-nowrap">
                                            <div class="relative hover:[&>div:nth-child(2)]:block cursor-pointer">
                                                <div class="flex items-center gap-x-2">
                                                    <Info class="min-w-4 max-w-4"/>
                                                    <span>{getApprovedCount(company)}/9</span>
                                                </div>
                                                <div class="hidden border border-gray-300 text-sm absolute top-0 right-0 translate-x-[100%] translate-y-[-50%] z-100 bg-white p-4 rounded-lg space-y-2">
                                                    <div class="w-full flex items-center justify-between gap-x-4">
                                                        <p>Company Profile</p>
                                                        <ApprovalStatusText status={company.profile.stat_req_company_profile}/>
                                                    </div>
                                                    <div class="w-full flex items-center justify-between gap-x-4">
                                                        <p>Business Permit</p>
                                                        <ApprovalStatusText status={company.profile.stat_req_business_permit}/>
                                                    </div>
                                                    <div class="w-full flex items-center justify-between gap-x-4">
                                                        <p>SEC</p>
                                                        <ApprovalStatusText status={company.profile.stat_req_sec}/>
                                                    </div>
                                                    <div class="w-full flex items-center justify-between gap-x-4">
                                                        <p>DTI / CDA Reg.</p>
                                                        <ApprovalStatusText status={company.profile.stat_req_dti_cda}/>
                                                    </div>
                                                    <div class="w-full flex items-center justify-between gap-x-4">
                                                        <p>Registry of Establishment</p>
                                                        <ApprovalStatusText status={company.profile.stat_req_reg_of_est}/>
                                                    </div>
                                                    <div class="w-full flex items-center justify-between gap-x-4">
                                                        <p>Phil-JobNet Reg.</p>
                                                        <ApprovalStatusText status={company.profile.stat_req_philjobnet_reg}/>
                                                    </div>
                                                    <div class="w-full flex items-center justify-between gap-x-4">
                                                        <p>Certification from DOLE</p>
                                                        <ApprovalStatusText status={company.profile.stat_req_cert_from_dole}/>
                                                    </div>
                                                    <div class="w-full flex items-center justify-between gap-x-4">
                                                        <p>Certification of No Pending Case</p>
                                                        <ApprovalStatusText status={company.profile.stat_req_cert_no_case}/>
                                                    </div>
                                                    <div class="w-full flex items-center justify-between gap-x-4">
                                                        <p>List of Vacancies</p>
                                                        <ApprovalStatusText status={company.profile.stat_req_list_of_vacancies}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="pl-4 py-2 text-nowrap">{company.profile.address}</td>
                                        <td class="pl-4 flex items-center gap-x-2">
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