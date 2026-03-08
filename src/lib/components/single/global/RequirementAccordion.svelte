<script>
	import { API_BASE_URL, ROLE } from "$lib/app/core/constants";
	import { Check, ChevronDown, ChevronRight, EllipsisVertical, File, RotateCw, Scale, X } from "lucide-svelte";
	import Button from "./Button.svelte";
	import { onMount } from "svelte";
	import { CompanyService } from "$lib/app/services/users/company";
	import { Toast } from "$lib/app/utils/swal";
	import { twMerge } from "tailwind-merge";
	import { user } from "$lib/app/stores/user";
	import CompanyRejectModal from "$lib/components/grouped/global/CompanyRejectModal.svelte";
	import PstaffNotesViewModal from "$lib/components/grouped/users/company/PstaffNotesViewModal.svelte";

    let {
        company,
        req,
        onViewAppeal
    } = $props();
    
    let collapsed = $state(false);
    let url = $state(null);
    let status = $state(null);
    let moreOpen = $state(false);

    let forRevisionOpen = $state(false);
    let forRevisionReq = $state(null);
    
    let appealsOpen = $state(false);
    let appealsModalDetails = $state(null);

    async function onApprove() {
        await CompanyService.approveRequirement(company, `stat_${req.pureName}`,
            async (data, stat) => {
                moreOpen = false;
                status = "Approved";

                await Toast.fire({
                    title: data?.message ?? "Document has been approved.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                moreOpen = false;
                
                await Toast.fire({
                    title: data?.message ?? "Unable to approve document.",
                    icon: "error"
                });
            },
        );
    }

    function onForRevise(req) {
        forRevisionReq = req;
        forRevisionOpen = true;
    }

    async function onForReviseConfirm(message) {
        await CompanyService.forReviseRequirement(
            { company, message, requirement_stat: `stat_${req.pureName}` },
            async (data, stat) => {
                forRevisionReq = null;
                forRevisionOpen = false;
                status = "For Revision";
                
                await Toast.fire({
                    title: data?.message ?? "Requirement has been marked for revision.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                forRevisionReq = null;
                forRevisionOpen = false;
                
                await Toast.fire({
                    title: data?.message ?? "Unable to mark the requirement as for revision.",
                    icon: "error"
                });
            },
        );
    }

    async function onForReviseCancel() {
        forRevisionReq = null;
        forRevisionOpen = false;
    }

    function onOpenAppeals() {
        moreOpen = false;
        appealsModalDetails = {
            companyId: company.profile.id,
            attr_name: req.pureName,
            display: req.display
        };
        appealsOpen = true;
    }

    async function onExitReviseRequests() {
        appealsModalDetails = null;
        appealsOpen = false;
    }
    
    onMount(() => {
        url = API_BASE_URL + `/uploads/company/${req.source}/${req.name}`;
        status = company.profile[`stat_${req.pureName}`];
    });
</script>

<div class="w-full space-y-2 py-1">
    <div class="grid grid-cols-2 w-full">
        <div class="flex items-center gap-x-2">
            <File class="w-4"/>
            <h1>{req.display}</h1>
        </div>
        <div class="flex items-center justify-end gap-x-3">
            <div>
                {#if status === "Pending"}
                    <p class="w-fit px-2 rounded border border-yellow-500 text-yellow-500">Pending</p>
                {:else if status === "Approved"}
                    <p class="w-fit px-2 rounded border border-green-500 text-green-500">Approved</p>
                {:else if status === "For Revision"}
                    <p class="w-fit px-2 rounded border border-purple-500 text-purple-500">For Revision</p>
                {/if}
            </div>
            {#if $user.role === ROLE.pstaff.value}
                <div class="relative pt-1">
                    {#if status !== "Approved"}
                        <button
                            title="More actions"
                            onclick={() => moreOpen = !moreOpen}
                            class="cursor-pointer"
                        >
                            <EllipsisVertical class="w-4 text-black-700"/>
                        </button>
                    {:else}
                        <Check class="w-4 text-black-700"/>
                    {/if}
                    {#if moreOpen}
                        <div class="absolute top-0 left-0 translate-x-[-100%] translate-y-[-100%] bg-white border border-gray-300 rounded-lg flex flex-col items-stretch shadow-lg overflow-clip">
                            <button
                                disabled={status === "Approved"}
                                onclick={async () => {
                                    moreOpen = false;
                                    
                                    await onApprove();
                                }}
                                class={twMerge("flex items-center gap-x-2 py-2 px-4 text-nowrap cursor-pointer text-sm hover:bg-gray-50", status === "Approved" && "text-gray-400")}
                            >
                                <Check class="w-4"/>
                                <span>Approved</span>
                            </button>
                            <hr class="border-t border-gray-200">
                            <button
                                disabled={status === "For Revision"}
                                onclick={() => onForRevise({
                                    reqAttr: req.pureName,
                                    display: req.display
                                })}
                                class={twMerge("flex items-center gap-x-2 py-2 px-4 text-nowrap cursor-pointer text-sm hover:bg-gray-50", status === "For Revision" && "text-gray-400")}
                            >
                                <RotateCw class="w-4"/>
                                <span>For Revision</span>
                            </button>
                            {#if status === "For Revision"}
                                <hr class="border-t border-gray-200">
                                <button
                                    onclick={onOpenAppeals}
                                    class="flex items-center gap-x-2 py-2 px-4 text-nowrap cursor-pointer text-sm hover:bg-gray-50"
                                >
                                    <Scale class="w-4"/>
                                    <span>View Appeals</span>
                                </button>
                            {/if}
                            <hr class="border-t border-gray-200">
                            <button
                                onclick={() => moreOpen = false}
                                class="flex items-center gap-x-2 py-2 px-4 text-nowrap cursor-pointer text-sm hover:bg-gray-50"
                            >
                                <X class="w-4"/>
                                <span>Cancel</span>
                            </button>
                        </div>
                    {/if}
                </div>
            {/if}
            <button
                title={"View " + req.display}
                onclick={() => collapsed = !collapsed}
                class="cursor-pointer"
            >
                {#if collapsed}
                    <ChevronDown class="w-4 text-black-700"/>
                {:else}
                    <ChevronRight class="w-4 text-black-700"/>
                {/if}
            </button>
        </div>
    </div>
    {#if collapsed}
        <iframe
            title={req.display}
            src={url}
            frameborder="0"
            class="min-h-142 w-full"
        ></iframe>
    {/if}
</div>

{#if forRevisionOpen}
    <CompanyRejectModal
        {company}
        onConfirmReject={onForReviseConfirm}
        onCancelReject={onForReviseCancel}
        forReq={true}
        reqName={forRevisionReq.display}
    />
{/if}

{#if appealsOpen}
    <PstaffNotesViewModal
        details={appealsModalDetails}
        onExit={onExitReviseRequests}
        forPstaff={true}
        {company}
    />
{/if}