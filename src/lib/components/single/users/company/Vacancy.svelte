<script>
	import { Briefcase, Check, ChevronDown, ChevronRight, Pen, Plus, Trash, X } from "lucide-svelte";
	import Button from "../../global/Button.svelte";
	import ConfirmPopup from "../../global/ConfirmPopup.svelte";
	import { onMount } from "svelte";
	import { twMerge } from "tailwind-merge";
	import { Toast } from "$lib/app/utils/swal";
	import { CompanyService } from "$lib/app/services/users/company";

    let {
        vacancy,
        vacancies = $bindable([])
    } = $props();

    let qualifications = $state([]);

    let jobTitle = $state("");
    let jobTitleBefore = $state("");
    let slots = $state(null);
    let slotsBefore = $state(null);
    
    let qualsOn = $state(true);
    
    let editVacancyOn = $state(false);
    let confirmDeleteOn = $state(false);
    let confirmVacEditOn = $state(false);

    let qualiNew = $state("");
    let qualiBefore = $state("");
    
    let editQualiOn = $state(false);
    let editQualiIndex = $state(null);
    let confirmQualiEditOn = $state(false);

    let confirmAddQualiOn = $state(false);
    
    let confirmDelQuali = $state(null);
    let confirmDelQualiOn = $state(false);

    async function onDeleteVacancy() {
        confirmDeleteOn = true;
    }

    async function onConfirmDeleteVacancy() {
        vacancies = vacancies.filter((v) => v.job_title !== vacancy.job_title);
        confirmDeleteOn = false;
    }

    async function onCancelDeleteVacancy() {
        confirmDeleteOn = false;
    }

    async function onVacEditVacancy() {
        confirmVacEditOn = true;
    }

    async function onConfirmEditVacancy() {
        const newVacDetails = {
            id: vacancy.id,
            newName: jobTitle,
            slots
        };

        await CompanyService.editVacancy(
            newVacDetails,
            async (data, stat) => {
                confirmVacEditOn = false;

                await Toast.fire({
                    title: data?.message ?? "Job title has been renamed.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                confirmVacEditOn = false;
                slots = slotsBefore;
                jobTitle = jobTitleBefore;

                await Toast.fire({
                    title: data?.message ?? "Unable to rename job title.",
                    icon: "error"
                });
            },
        );
    }

    async function onCancelVacEditVacancy() {
        confirmVacEditOn = false;
    }

    async function onConfirmEditQualification() {
        await CompanyService.editQualification(
            { qualifications, id: vacancy.id },
            async (data, stat) => {
                confirmQualiEditOn = false;
                qualiBefore = "";
                editQualiOn = false;
                editQualiIndex = null;

                await Toast.fire({
                    title: data?.message ?? "Qualification has been updated.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                confirmQualiEditOn = false;
                qualifications[editQualiIndex] = qualiBefore;
                qualiBefore = "";
                editQualiOn = false;
                editQualiIndex = null;

                await Toast.fire({
                    title: data?.message ?? "Unable to update qualification.",
                    icon: "error"
                });
            },
        )
    }
    
    async function onCancelEditQualification() {
        confirmQualiEditOn = false;
        qualifications[editQualiIndex] = qualiBefore;
        qualiBefore = "";
        editQualiOn = false;
        editQualiIndex = null;
    }

    async function onConfirmAddQualification() {
        await CompanyService.editQualification(
            { qualifications: [...qualifications, qualiNew.trim()], id: vacancy.id },
            async (data, stat) => {
                qualifications.push(qualiNew);

                qualiNew = "";
                confirmAddQualiOn = false;
                
                await Toast.fire({
                    title: data?.message ?? "Qualification has been added.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                confirmAddQualiOn = false;

                await Toast.fire({
                    title: data?.message ?? "Unable to add qualification.",
                    icon: "error"
                });
            },
        );
    }

    async function onCancelAddQualification() {
        confirmAddQualiOn = false;
    }

    function onDelQualification(quali) {
        confirmDelQuali = quali;
        confirmDelQualiOn = true;
    }

    async function onConfirmDelQualification() {
        await CompanyService.editQualification(
            { qualifications: [...qualifications.filter((q) => q !== confirmDelQuali)], id: vacancy.id },
            async (data, stat) => {
                qualifications = qualifications.filter((q) => q !== confirmDelQuali);
                confirmDelQuali = null;
                confirmDelQualiOn = false;
                
                await Toast.fire({
                    title: data?.message ?? "Qualification has been deleted.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                confirmDelQuali = null;
                confirmDelQualiOn = false;

                await Toast.fire({
                    title: data?.message ?? "Unable to delete qualification.",
                    icon: "error"
                });
            },
        );
    }

    function onCancelDelQualification(quali) {
        confirmDelQuali = null;
        confirmDelQualiOn = false;
    }

    onMount(() => {
        slots = vacancy.slots;
        jobTitle = vacancy.job_title;
        qualifications = JSON.parse(vacancy.qualifications);
    });
</script>
<div class="w-full">
    <div class="w-full flex items-center gap-x-4">
        <div class="flex items-center grow gap-x-4">
            {#if !editVacancyOn}
                <Briefcase class="w-4"/>
            {/if}
            {#if editVacancyOn}
                <div class="grow">
                    <p class="text-sm mb-1 text-gray-500">Job Title</p>
                    <input
                        type="text"
                        bind:value={jobTitle}
                        readonly={!editVacancyOn}
                        class={twMerge("w-full rounded-lg", editVacancyOn ? "border border-gray-300" : "border-none")}
                    >
                </div>
                <div class="max-w-1/5">
                    <p class="text-sm mb-1 text-gray-500">Slots</p>
                    <input
                        type="number"
                        min="1"
                        bind:value={slots}
                        class={twMerge("w-full rounded-lg", editVacancyOn ? "border border-gray-300" : "border-none")}
                    >
                </div>
            {:else}
                <p class="px-2">{jobTitle} - {slots} Slots</p>
            {/if}
        </div>
        <div class="flex items-center gap-x-2 pt-6">
            {#if editVacancyOn}
                <Button
                    size="s"
                    Icon={Check}
                    onclick={async () => {
                        if (vacancy.job_title === jobTitle.trim() && vacancy.slots === slots) {
                            editVacancyOn = false;

                            await Toast.fire({
                                title: "The were no changes made.",
                                icon: "warning"
                            });
                            return;
                        }
                        
                        editVacancyOn = false;
                        confirmVacEditOn = true;
                    }}
                    class="bg-green-500"
                />
                <Button
                    size="s"
                    Icon={X}
                    onclick={() => {
                        slots = slotsBefore;
                        jobTitle = jobTitleBefore;
                        editVacancyOn = false;
                    }}
                    class="bg-red-500"
                />
            {:else}
                <Button
                    size="s"
                    Icon={Pen}
                    onclick={() => {
                        slotsBefore = slots;
                        jobTitleBefore = jobTitle;
                        editVacancyOn = true;
                    }}
                    class="bg-blue-500"
                />
                {#if vacancies.length > 1}
                    <Button
                        size="s"
                        Icon={Trash}
                        onclick={onDeleteVacancy}
                        class="bg-red-500"
                    />
                {/if}
            {/if}
            <button
                class="cursor-pointer"
                onclick={() => qualsOn = !qualsOn}
            >
                {#if qualsOn}
                    <ChevronDown class="w-4"/>
                {:else}
                    <ChevronRight class="w-4"/>
                {/if}
            </button>
        </div>
    </div>
    {#if qualsOn}
        <div class="w-full pl-4 mt-1">
            {#each qualifications as qualification, index}
                <div class="w-full flex items-center gap-x-4">
                    <div class="flex items-center grow">
                        {#if !(editQualiOn && editQualiIndex === index)}
                            <Check class="w-4"/>
                        {/if}

                        <input
                            type="text"
                            bind:value={qualifications[index]}
                            readonly={!(editQualiOn && editQualiIndex === index)}
                            class={twMerge("grow rounded-lg", editQualiOn && editQualiIndex === index ? "border border-gray-300" : "border-none")}
                        >
                    </div>
                    <div class="flex items-center gap-x-2 pr-6">
                        {#if editQualiOn && index === editQualiIndex}
                            <Button
                                size="s"
                                Icon={Check}
                                onclick={() => {
                                    confirmQualiEditOn = true;
                                }}
                                class="bg-blue-500"
                            />
                            <Button
                                size="s"
                                Icon={X}
                                onclick={() => {
                                    editQualiOn = false;
                                    editQualiIndex = null;
                                    slots = slotsBefore;
                                    qualifications[index] = qualiBefore;
                                    qualiBefore = "";
                                }}
                                class="bg-red-500"
                            />
                        {:else}
                            <Button
                                size="s"
                                Icon={Pen}
                                onclick={() => {
                                    editQualiOn = true;
                                    editQualiIndex = index;
                                    qualiBefore = qualification;
                                }}
                                class="bg-blue-500"
                            />
                            {#if qualifications.length > 1}
                                <Button
                                    size="s"
                                    Icon={Trash}
                                    onclick={() => onDelQualification(qualification)}
                                    class="bg-red-500"
                                />
                            {/if}
                        {/if}
                    </div>
                </div>
            {/each}
            <div class="grow flex items-center gap-x-4 pr-6 mt-1">
                <input
                    bind:value={qualiNew}
                    type="text"
                    placeholder="Add a new qualification here..."
                    class="border border-gray-300 rounded-lg grow"
                >
                <div class="flex items-center gap-x-2">
                    <Button
                        size="s"
                        Icon={Plus}
                        onclick={async () => {
                            if (!qualifications.includes(qualiNew.trim())) {
                                confirmAddQualiOn = true;
                            } else {
                                await Toast.fire({
                                    title: "Qualifications was already added.",
                                    icon: "error"
                                });
                            }
                        }}
                        class="bg-green-500"
                    />
                </div>
            </div>
        </div>
    {/if}
</div>

{#if confirmDeleteOn}
    <ConfirmPopup
        confirmText={`Delete "${vacancy.job_title}"?`}
        onConfirm={onConfirmDeleteVacancy}
        onCancel={onCancelDeleteVacancy}
    />
{/if}

{#if confirmVacEditOn}
    <ConfirmPopup
        confirmText={"Edit Vacancy?"}
        onConfirm={onConfirmEditVacancy}
        onCancel={onCancelVacEditVacancy}
    />
{/if}

{#if confirmQualiEditOn}
    <ConfirmPopup
        confirmText={`Edit qualification?`}
        onConfirm={onConfirmEditQualification}
        onCancel={onCancelEditQualification}
    />
{/if}

{#if confirmAddQualiOn}
    <ConfirmPopup
        confirmText={`Add qualification?`}
        onConfirm={onConfirmAddQualification}
        onCancel={onCancelAddQualification}
    />
{/if}

{#if confirmDelQualiOn}
    <ConfirmPopup
        confirmText={`Delete qualification?`}
        onConfirm={onConfirmDelQualification}
        onCancel={onCancelDelQualification}
    />
{/if}