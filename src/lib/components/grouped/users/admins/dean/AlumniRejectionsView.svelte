<script>
	import { RotateCw, X } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import { CompanyService } from "$lib/app/services/users/company";
	import { Toast } from "$lib/app/utils/swal";
	import { AlumniService } from "$lib/app/services/users/alumni";

    let {
        rejections,
        onExitRejections,
        onAfterAlumniPend
    } = $props();

    let confirmPendOpen = $state(false);
    let pendInfo = $state(null);

    function onPendOpen() {
        confirmPendOpen = true;
    }
    
    function onPendExit() {
        confirmPendOpen = false;
    }

    async function onPendConfirm() {
        await AlumniService.pend(
            rejections.alumni,
            async (data, status) => {
                confirmPendOpen = false;
                
                await onAfterAlumniPend();
                await Toast.fire({
                    title: data?.message ?? "Alumni has been enlisted as pending.",
                    icon: "success"
                });
            },
            async (data, status) => {
                confirmPendOpen = false;
                
                await Toast.fire({
                    title: data?.message ?? "Unable to pend alumni.",
                    icon: "error"
                })
            },
        );
    }
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
    <HeadBar
        title={`Rejection Appeals - ${rejections.alumni.profile.first_name}${rejections.alumni.profile.name_extension && (" " + rejections.alumni.profile.name_extension)} ${rejections.alumni.profile.middle_name && (rejections.alumni.profile.middle_name + " ")}${rejections.alumni.profile.last_name}`}
        BtnIcon={X}
        btnLabel={"Exit"}
        onBtnClick={onExitRejections}
    />
    <div class="h-[calc(100%-64px)] overflow-auto">
        <div class="px-6 space-y-6 min-w-max">
            {#each rejections.list as rejection, index}
                <div class="border border-gray-200 rounded-lg bg-white space-y-6 overflow-clip my-6 p-6">
                    <span class="text-sm text-gray-500">Rejection from {new Date(rejection.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    })}</span>
                    <p class="mt-3">{rejection.message}</p>

                    {#if rejection.appeal !== null}
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm text-gray-500">Appeal from {new Date(rejection.appeal.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            })} - {rejections.alumni.profile.name}</p>
                            {#if index === 0}
                                <Button
                                    title={`Mark ${rejections.alumni.profile.name} as pending?`}
                                    Icon={RotateCw}
                                    label="Mark as Pending"
                                    size="s"
                                    onclick={onPendOpen}
                                    class="bg-green-500"
                                />
                            {/if}
                        </div>
                        <p>{rejection.appeal.message}</p>
                    {:else}
                        <hr class="border-t border-gray-200 mt-6">
                        <p class="text-sm text-gray-500 mt-3 mb-0">No appeal from {rejections.alumni.profile.name} yet.</p>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>
{#if confirmPendOpen}
    <ConfirmPopup
        confirmText={`Enlist ${rejections.alumni.profile.first_name}${rejections.alumni.profile.name_extension && (" " + rejections.alumni.profile.name_extension)} ${rejections.alumni.profile.middle_name && (rejections.alumni.profile.middle_name + " ")}${rejections.alumni.profile.last_name} into pending alumni?`}
        onConfirm={onPendConfirm}
        onCancel={onPendExit}
    />
{/if}