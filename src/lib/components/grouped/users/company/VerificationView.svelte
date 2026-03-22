<script>
	import { twMerge } from "tailwind-merge";
	import HeadBar from "../admins/HeadBar.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import { onMount } from "svelte";
	import { CompanyService } from "$lib/app/services/users/company";
	import { user } from "$lib/app/stores/user";
	import { Toast } from "$lib/app/utils/swal";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { EllipsisVertical, Eye, File, NotebookPen, Pen, Scroll, Send, Upload, X } from "lucide-svelte";
	import Rejection from "$lib/components/single/users/company/Rejection.svelte";
	import VerificationStatusText from "$lib/components/single/users/company/VerificationStatusText.svelte";
	import VerificationStatusTextSimple from "$lib/components/single/users/company/VerificationStatusTextSimple.svelte";
	import PstaffNotesViewModal from "./PstaffNotesViewModal.svelte";
	import ReuploadButton from "./ReuploadButton.svelte";
	import PreviewModal from "$lib/components/single/users/company/PreviewModal.svelte";
	import VacanciesModal from "$lib/components/single/users/company/VacanciesModal.svelte";

    let {
        query = $bindable(""),
        status = $bindable("published"),
        requirements,
    } = $props();

    let sourceRole = $state("sysad");
    let rejectionsReady = $state(false);
    let rejections = $state([]);
    let message = $state("");
    let reqStatsOpen = $state(false);
    let reviseRequestsOpen = $state(false);
    let reviseRequestsModalDetails = $state(null);
    let previewOpen = $state(false);
    let previewDisplay = $state(null);
    let previewFile = $state(null);
    let previewFileSource = $state(null);
    let vacViewOpen = $state(false);

    async function onFetchRejectionAppeals() {
        await CompanyService.getRejectionAppeals(
            $user,
            async (data, status) => {
                rejectionsReady = true;
                rejections = data;
            },
            async (data, status) => {
                rejectionsReady = true;

                await Toast.fire({
                    title: data?.message ?? "Failed to get rejections.",
                    icon: "error"
                });
            },
            sourceRole
        );
    }

    async function onAppealSend(rejection_id) {
        if (message.trim().length === 0) {
            Toast.fire({
                title: "Please write an appeal first.",
                icon: "error"
            });
            return;
        }
        
        await CompanyService.writeRejectionAppeal(
            { message, rejection_id },
            async (data, status) => {
                await onFetchRejectionAppeals();
                await Toast.fire({
                    title: data?.message ?? "Your appeal was sent.",
                    icon: "success"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to create an appeal.",
                    icon: "error"
                });
            },
        )
    }

    async function onOpenReviseRequests(companyId, display, attrName) {
        reviseRequestsModalDetails = { companyId, display, attr_name: attrName };
        reviseRequestsOpen = true;
    }

    async function onExitReviseRequests() {
        reviseRequestsModalDetails = null;
        reviseRequestsOpen = false;
    }

    onMount(onFetchRejectionAppeals);
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
    <HeadBar
        title="Manage Verification"
    />
    <div class="h-[calc(100%-64px)] overflow-auto">
        <div class="px-6">
            <div class="overflow-clip my-6">
                <div class="flex items-center w-full border-b border-gray-200 bg-gray-50 rounded-tl-lg rounded-tr-lg">
                    <button
                        onclick={async () => {
                            sourceRole = "sysad";

                            await onFetchRejectionAppeals();
                        }}
                        class="min-w-48 min-h-12 relative overflow-visible cursor-pointer"
                    >
                        <div class={
                            twMerge(
                                "text-nowrap absolute left-0 top-0 h-full w-full translate-y-px pt-3 border-gray-200",
                                sourceRole === "sysad" ? "border-r border-l border-t rounded-tl-lg rounded-tr-lg bg-white" : "border-b text-gray-400"
                            )
                        }>System Administrator</div>
                    </button>
                    <button
                        onclick={async () => {
                            sourceRole = "pstaff";

                            await onFetchRejectionAppeals();
                        }}
                        class="min-w-29 min-h-12 relative overflow-visible cursor-pointer"
                    >
                        <div class={
                            twMerge(
                                "text-nowrap absolute left-0 top-0 h-full w-full translate-y-px pt-3 border-gray-200",
                                sourceRole === "pstaff" ? "border-r border-l border-t rounded-tl-lg rounded-tr-lg bg-white" : "border-b text-gray-400"
                            )
                        }>PESO Staff</div>
                    </button>
                </div>
                <div class="w-full border border-t-0 border-gray-200 pb-6 rounded-bl-lg rounded-br-lg bg-white pt-4">
                    {#if sourceRole === "sysad"}
                        <div class="w-full px-6 pt-2 space-y-6">
                            <VerificationStatusText {sourceRole} />
                            {#if $user.profile.ver_stat_sysad === "Rejected"}
                                {#if rejectionsReady && rejections.length > 0}
                                    {#each rejections as rejection}
                                        <Rejection
                                            bind:message={message}
                                            {rejection}
                                            {onAppealSend}
                                        />
                                    {/each}
                                {/if}
                            {/if}
                        </div>
                    {:else}
                        <div class="px-6 pt-2">
                            <VerificationStatusText {sourceRole}>
                                <Button
                                    title={reqStatsOpen ? "Close requirements' status view" : "View or update requirements' statuses"}
                                    onclick={() => reqStatsOpen = !reqStatsOpen}
                                    Icon={reqStatsOpen ? X : Eye}
                                    label={reqStatsOpen ? "Close" : "View Requirements"}
                                    size="s"
                                    class="bg-blue-500"
                                />
                            </VerificationStatusText>
                        </div>
                        {#if reqStatsOpen}
                            <div class="w-full grid grid-cols-15 gap-x-3 my-4 px-6">
                                <span class="font-bold col-span-2">Status</span>
                                <span class="font-bold col-span-11">Requirement</span>
                                <span class="font-bold col-span-2">
                                    {(requirements.filter((r) => r.status === "Approved").length === 8 && $user.profile.stat_req_list_of_vacancies === "Approved") ? "" : "Actions"}
                                </span>
                            </div>
                            <div class="w-full space-y-4 px-6">
                                {#each requirements as req}
                                    <div class="w-full">
                                        <div class="w-full grid grid-cols-15 gap-x-3">
                                            <VerificationStatusTextSimple
                                                status={req.status}
                                                class="col-span-2"
                                            />
                                            <h1 class="col-span-11">{req.display}</h1>
                                            <div class="flex items-center gap-x-2">
                                                <Button
                                                    title="View PESO Staf's revision requests"
                                                    Icon={NotebookPen}
                                                    size="s"
                                                    onclick={() => onOpenReviseRequests($user.profile.id, req.display, req.pureName)}
                                                    class="bg-blue-500"
                                                />
                                                <Button
                                                    title="View Requirement"
                                                    Icon={Eye}
                                                    size="s"
                                                    onclick={() => {
                                                        previewOpen = true;
                                                        previewFile = req.file;
                                                        previewFileSource = req.source;
                                                        previewDisplay = req.display;
                                                    }}
                                                    class="bg-blue-500"
                                                />
                                                {#if req.status !== "Pending"}
                                                    <ReuploadButton
                                                        key={req.pureName}
                                                        display={req.display}
                                                        source={req.source}
                                                    />
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                                <div class="w-full">
                                    <div class="w-full grid grid-cols-15 gap-x-3">
                                        <VerificationStatusTextSimple
                                            status={$user.profile.stat_req_list_of_vacancies}
                                            class="col-span-2"
                                        />
                                        <h1 class="col-span-11">List of Vacancies</h1>
                                        <div class="flex items-center gap-x-2">
                                            <Button
                                                title="View PESO Staf's revision requests"
                                                Icon={NotebookPen}
                                                size="s"
                                                onclick={() => onOpenReviseRequests($user.profile.id, "List of Vacancies", "req_list_of_vacancies")}
                                                class="bg-blue-500"
                                            />
                                            <Button
                                                title="Update"
                                                Icon={Pen}
                                                size="s"
                                                onclick={() => vacViewOpen = true}
                                                class="bg-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {:else}
                            {#if $user.profile.ver_stat_pstaff === "Rejected"}
                                <div class="w-full px-6 pt-2 space-y-6">
                                    {#if rejectionsReady && rejections.length > 0}
                                        {#each rejections as rejection}
                                            <Rejection
                                                bind:message={message}
                                                {rejection}
                                                {onAppealSend}
                                            />
                                        {/each}
                                    {/if}
                                </div>
                            {/if}
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

{#if reviseRequestsOpen}
    <PstaffNotesViewModal
        details={reviseRequestsModalDetails}
        onExit={onExitReviseRequests}
    />
{/if}

{#if previewOpen}
    <PreviewModal
        display={previewDisplay}
        fileName={previewFile}
        fileSource={previewFileSource}
        onExit={() => {
            previewOpen = false;
            previewDisplay = null;
            previewFile = null;
            previewFileSource = null;
        }}
    />
{/if}

{#if vacViewOpen}
    <VacanciesModal onExit={() => vacViewOpen = false}/>
{/if}