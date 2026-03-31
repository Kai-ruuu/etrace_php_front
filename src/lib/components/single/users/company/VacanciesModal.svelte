<script>
	import { CompanyService } from "$lib/app/services/users/company";
	import { user } from "$lib/app/stores/user";
	import { Toast } from "$lib/app/utils/swal";
	import { Check, Pen, Plus, Trash, X } from "lucide-svelte";
	import { onMount } from "svelte";
	import Button from "../../global/Button.svelte";
	import Vacancy from "./Vacancy.svelte";
	import { twMerge } from "tailwind-merge";
	import { UserService } from "$lib/app/services/users/user";

    let { onExit } = $props();
    let vacancies = $state(null);
    let newVacancy = $state({
        job_title: { value: "", error: "" },
        slots: { value: 1, error: "" },
        qualifications: []
    });
    let newQuali = $state("");
    let qualiBefore = $state("");
    let editQualiOn = $state(false);
    let editQualiIndex = $state(null);

    async function onAddVacancy() {
        await CompanyService.addVacancy(
            {
                job_title: newVacancy.job_title.value,
                slots: newVacancy.slots.value,
                qualifications: JSON.stringify(newVacancy.qualifications)
            },
            async (data, stat) => {
                newVacancy = {
                    job_title: { value: "", error: "" },
                    slots: { value: 1, error: "" },
                    qualifications: []
                };

                vacancies.push(data);
                await Toast.fire({
                    title: "Vacancy has been added.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to add vacancy.",
                    icon: "error"
                });
            },
        );
    }

    onMount(() => vacancies = $user.profile.vacancies);
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 md:w-1/2">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">View or Update List of Vacancies</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        <div>
            {#each vacancies as vacancy}
                <Vacancy {vacancy} bind:vacancies={vacancies}/>
            {/each}
            <hr class="border-t border-gray-200 mt-6 mb-4">
            <p>Add New Vacancy</p>
            <div class="grow mt-2 pr-6">
                <div class="w-full flex items-start gap-x-4 pr-14 mb-4">
                    <div class="grow">
                        <p class="text-sm mb-1 text-gray-500">Job Title</p>
                        <input
                            type="text"
                            bind:value={newVacancy.job_title.value}
                            placeholder="Add a new vacancy here..."
                            class="w-full border border-gray-300 rounded-lg"
                        >
                        {#if newVacancy.job_title.error}
                            <p class="text-red-500 text-sm">{newVacancy.job_title.error}</p>
                        {/if}
                    </div>
                    <div class="max-w-1/5">
                        <p class="text-sm mb-1 text-gray-500">Slots</p>
                        <input
                            type="number"
                            min="1"
                            bind:value={newVacancy.slots.value}
                            placeholder="Slots"
                            class="w-full border border-gray-300 rounded-lg"
                        >
                        {#if newVacancy.slots.error}
                            <p class="text-red-500 text-sm">{newVacancy.slots.error}</p>
                        {/if}
                    </div>
                </div>

                <!-- each new qualis here -->
                 {#each newVacancy.qualifications as quali, index}
                    <div class="w-full flex items-center gap-x-4 pl-4">
                        <div class="flex items-center grow">
                            {#if !(editQualiOn && editQualiIndex === index)}
                                <Check class="w-4"/>
                            {/if}

                            <input
                                type="text"
                                bind:value={newVacancy.qualifications[index]}
                                readonly={!(editQualiOn && editQualiIndex === index)}
                                class={twMerge("grow rounded-lg", editQualiOn && editQualiIndex === index ? "border border-gray-300" : "border-none")}
                            >
                        </div>
                        <div class="flex items-center gap-x-2">
                            {#if editQualiOn && index === editQualiIndex}
                                <Button
                                    size="s"
                                    Icon={Check}
                                    onclick={() => editQualiOn = false}
                                    class="bg-blue-500"
                                />
                                <Button
                                    size="s"
                                    Icon={X}
                                    onclick={() => {
                                        editQualiOn = false;
                                        editQualiIndex = null;
                                        newVacancy.qualifications.splice(index, 1, qualiBefore);
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
                                        qualiBefore = newVacancy.qualifications[index];
                                    }}
                                    class="bg-blue-500"
                                />
                                {#if newVacancy.qualifications.length > 1}
                                    <Button
                                        size="s"
                                        Icon={Trash}
                                        onclick={() => newVacancy.qualifications = newVacancy.qualifications.filter((q) => q !== quali)}
                                        class="bg-red-500"
                                    />
                                {/if}
                            {/if}
                        </div>
                    </div>
                 {/each}
                
                <div class="grow flex items-center gap-x-4 mt-4">
                    <input
                        type="text"
                        bind:value={newQuali}
                        placeholder="Add a new qualification here..."
                        class="border border-gray-300 rounded-lg grow"
                    >
                    <div class="flex items-center gap-x-2">
                        <Button
                            size="s"
                            Icon={Plus}
                            onclick={() => {
                                if (newQuali.trim().length === 0) {
                                    // err here
                                    return;
                                }

                                if (!newVacancy.qualifications.includes(newQuali.trim())) {
                                    newVacancy.qualifications.push(newQuali.trim());
                                    newQuali = "";
                                } else {
                                    
                                }
                            }}
                            class="bg-green-500"
                        />
                    </div>
                </div>
            </div>
            <Button
                Icon={Plus}
                label="Add Vacancy"
                onclick={async () => {
                    let hasErrors = false;
                    
                    if (newVacancy.job_title.value.trim().length === 0) {
                        newVacancy.job_title.error = "Job title is required.";
                        hasErrors = true;
                    } else {
                        newVacancy.job_title.error = "";
                    }

                    if (newVacancy.slots.value <= 0) {
                        newVacancy.slots.error = "Vacancy should have at least 1 slot.";
                        hasErrors = true;
                    } else {
                        newVacancy.slots.error = "";
                    }

                    if (newVacancy.qualifications.length < 1) {
                        hasErrors = true;

                        await Toast.fire({
                            title: "Vacancy should have at least 1 qualification.",
                            icon: "error"
                        });
                    }

                    if (hasErrors) {
                        return;
                    }

                    await onAddVacancy();
                }}
                class="w-full mt-4"
            />
        </div>
    </div>
</div>