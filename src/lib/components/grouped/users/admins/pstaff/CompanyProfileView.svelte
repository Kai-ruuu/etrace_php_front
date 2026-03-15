<script>
	import { BadgeCheck, Check, EllipsisVertical, Factory, Mail, MapPin, RotateCw, Scale, X } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import { API_BASE_URL } from "$lib/app/core/constants";
	import RequirementAccordion from "$lib/components/single/global/RequirementAccordion.svelte";
	import Vacancy from "$lib/components/single/global/Vacancy.svelte";
	import { onMount } from "svelte";
	import { CompanyService } from "$lib/app/services/users/company";
	import { Toast } from "$lib/app/utils/swal";
	import { twMerge } from "tailwind-merge";
	import CompanyRejectModal from "$lib/components/grouped/global/CompanyRejectModal.svelte";
	import PstaffNotesViewModal from "../../company/PstaffNotesViewModal.svelte";

    let {
        company,
        onViewExit,
    } = $props();

    let forReviseVacOpen = $state(null);
    let vacanciesMoreOpen = $state(false);
    let vacanciesStatus = $state(null);
    let vacForRevisionOpen = $state(false);
    let vacAppealsOpen = $state(false);
    let vacAppealsModalDetails = $state(null);
    
    function onOpenVacAppeals() {
        vacanciesMoreOpen = false;
        vacAppealsModalDetails = {
            companyId: company.profile.id,
            attr_name: "req_list_of_vacancies",
            display: "List of Vacancies"
        };
        vacAppealsOpen = true;
    }

    async function onExitVacReviseRequests() {

        vacAppealsModalDetails = null;
        vacAppealsOpen = false;
    }
    
    let requirements = [
        { name: "req_company_profile", source: "profile",        display: "Company Profile"},
        { name: "req_business_permit", source: "permit",         display: "Business Permit"},
        { name: "req_sec",             source: "sec",            display: "SEC"},
        { name: "req_dti_cda",         source: "dti_cda",        display: "DTI / CDA Reg."},
        { name: "req_reg_of_est",      source: "reg_of_est",     display: "Registry of Establishment fr. DOLE"},
        { name: "req_philjobnet_reg",  source: "reg_philjobnet", display: "Phil-JobNet Reg."},
        { name: "req_cert_from_dole",  source: "cert_from_dole", display: "Certification from DOLE Provincial Office"},
        { name: "req_cert_no_case",    source: "cert_no_case",   display: "Certification of No Pending Case"},
    ];

    async function onApproveVac() {
        await CompanyService.approveRequirement(company, "stat_req_list_of_vacancies",
            async (data, stat) => {
                vacanciesMoreOpen = false;
                vacanciesStatus = "Approved";

                await Toast.fire({
                    title: "List of vacancies has been approved.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                vacanciesMoreOpen = false;
                
                await Toast.fire({
                    title: data?.message ?? "Unable to approve document.",
                    icon: "error"
                });
            },
        );
    }

    async function onForReviseVac() {
        vacForRevisionOpen = true;
    }

    async function onForReviseConfirm(message) {
        await CompanyService.forReviseRequirement(
            { company, message, requirement_stat: "stat_req_list_of_vacancies" },
            async (data, stat) => {
                vacanciesMoreOpen = false;
                vacForRevisionOpen = false;
                vacanciesStatus = "For Revision";
                
                await Toast.fire({
                    title: data?.message ?? "Requirement has been marked for revision.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                vacanciesMoreOpen = false;
                vacForRevisionOpen = false;
                
                await Toast.fire({
                    title: data?.message ?? "Unable to mark the requirement as for revision.",
                    icon: "error"
                });
            },
        );
    }

    function onForReviseCancel() {
        vacForRevisionOpen = false;
    }

    onMount(() => vacanciesStatus = company.profile["stat_req_list_of_vacancies"]);
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
    <HeadBar
        title={`Company Profile - ${company.profile.name}`}
        BtnIcon={X}
        btnLabel={"Exit"}
        onBtnClick={onViewExit}
    />
    <div class="h-[calc(100%-64px)] overflow-auto">
        <div class="px-6 min-w-max">
            <div class="border border-gray-200 rounded-lg bg-white space-y-6 overflow-clip my-6 p-6">
                <div class="flex flex-col gap-y-2">
                    <div class="flex items-center gap-x-4">
                        <div
                            style="background-image: url({API_BASE_URL + `/uploads/company/logo/${company.profile.req_logo}`})"
                            class="min-w-18 min-h-18 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
                        ></div>
                        <div class="flex flex-col gap-y-2">
                            <h1 class="text-xl font-bold">{company.profile.name}</h1>
                            {#if company.profile.ver_stat_sysad === "Verified" || company.profile.ver_stat_pstaff === "Verified"}
                                <div class="flex items-center gap-x-2">
                                    {#if company.profile.ver_stat_sysad === "Verified"}
                                        <div class="flex items-center gap-x-2 px-2 rounded border border-blue-500">
                                            <BadgeCheck class="w-4 text-blue-500"/>
                                            <p class="w-fit text-blue-500">System Admin Verified</p>
                                        </div>
                                    {/if}
                                    {#if company.profile.ver_stat_pstaff === "Verified"}
                                        <div class="flex items-center gap-x-2 px-2 rounded border border-green-500">
                                            <BadgeCheck class="w-4 text-green-500"/>
                                            <p class="w-fit text-green-500">PESO Staff Verified</p>
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    </div>
                    <div class="">
                        <div class="flex items-center gap-x-2 mt-2">
                            <Mail class="w-4"/>
                            <h2 class="">{company.email}</h2>
                        </div>
                        <div class="flex items-center gap-x-2">
                            <MapPin class="w-4"/>
                            <h2 class="">{company.profile.address}</h2>
                        </div>
                        <div class="flex items-center gap-x-2">
                            <Factory class="w-4"/>
                            <h2 class="">{company.profile.industry}</h2>
                        </div>
                    </div>
                </div>
                <hr class="border-t border-gray-200">
                <div>
                    <h1 class="font-bold mb-2">Submitted Requirements</h1>
                    {#each requirements as req}
                        <RequirementAccordion
                        {company}
                        req={{
                            pureName: req.name,
                            name: company.profile[req.name],
                            source: req.source,
                            display: req.display
                        }}/>
                    {/each}
                </div>
                <hr class="border-t border-gray-200">
                <div>
                    <div class="flex items-center justify-between pr-8">
                        <h1 class="font-bold mb-2">List of Vacancies</h1>
                        <div class="flex items-center gap-x-2">
                            <div>
                                {#if vacanciesStatus === "Pending"}
                                    <p class="w-fit px-2 rounded border border-yellow-500 text-yellow-500">Pending</p>
                                {:else if vacanciesStatus === "Approved"}
                                    <p class="w-fit px-2 rounded border border-green-500 text-green-500">Approved</p>
                                {:else if vacanciesStatus === "For Revision"}
                                    <p class="w-fit px-2 rounded border border-purple-500 text-purple-500">For Revision</p>
                                {/if}
                            </div>
                            <div class="relative pt-2">
                                {#if vacanciesStatus !== "Approved"}
                                    <button
                                        title="More actions"
                                        onclick={() => vacanciesMoreOpen = !vacanciesMoreOpen}
                                        class="cursor-pointer"
                                    >
                                        <EllipsisVertical class="w-4 text-black-700"/>
                                    </button>
                                {:else}
                                    <Check class="w-4 text-black-700"/>
                                {/if}
                                {#if vacanciesMoreOpen}
                                    <div class="absolute top-0 left-0 translate-x-[-100%] translate-y-[-100%] bg-white border border-gray-300 rounded-lg flex flex-col items-stretch shadow-lg overflow-clip">
                                        <button
                                            disabled={vacanciesStatus === "Approved"}
                                            onclick={onApproveVac}
                                            class={twMerge("flex items-center gap-x-2 py-2 px-4 text-nowrap cursor-pointer text-sm hover:bg-gray-50", vacanciesStatus === "Approved" && "text-gray-400")}
                                        >
                                            <Check class="w-4"/>
                                            <span>Approved</span>
                                        </button>
                                        <hr class="border-t border-gray-200">
                                        <button
                                            disabled={vacanciesStatus === "For Revision"}
                                            onclick={onForReviseVac}
                                            class={twMerge("flex items-center gap-x-2 py-2 px-4 text-nowrap cursor-pointer text-sm hover:bg-gray-50", vacanciesStatus === "For Revision" && "text-gray-400")}
                                        >
                                            <RotateCw class="w-4"/>
                                            <span>For Revision</span>
                                        </button>
                                        {#if vacanciesStatus === "For Revision"}
                                            <hr class="border-t border-gray-200">
                                            <button
                                                onclick={onOpenVacAppeals}
                                                class="flex items-center gap-x-2 py-2 px-4 text-nowrap cursor-pointer text-sm hover:bg-gray-50"
                                            >
                                                <Scale class="w-4"/>
                                                <span>View Appeals</span>
                                            </button>
                                        {/if}
                                        <hr class="border-t border-gray-200">
                                        <button
                                            onclick={() => vacanciesMoreOpen = false}
                                            class="flex items-center gap-x-2 py-2 px-4 text-nowrap cursor-pointer text-sm hover:bg-gray-50"
                                        >
                                            <X class="w-4"/>
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                    {#each company.profile.vacancies as vacancy}
                        <Vacancy {vacancy}/>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

{#if vacForRevisionOpen}
    <CompanyRejectModal
        {company}
        onConfirmReject={onForReviseConfirm}
        onCancelReject={onForReviseCancel}
        forReq={true}
        reqName="List of Vacancies"
    />
{/if}

{#if vacAppealsOpen}
    <PstaffNotesViewModal
        details={vacAppealsModalDetails}
        onExit={onExitVacReviseRequests}
        forPstaff={true}
        {company}
    />
{/if}