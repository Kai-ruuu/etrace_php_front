<script>
	import { RotateCw, X } from "lucide-svelte";
	import HeadBar from "../users/admins/HeadBar.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import { CompanyService } from "$lib/app/services/users/company";
	import { Toast } from "$lib/app/utils/swal";

    let {
        rejections, // has .company
        onExitRejections,
        onAfterCompanyPend
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
        await CompanyService.pend(
            rejections.company,
            async (data, status) => {
                confirmPendOpen = false;
                
                onAfterCompanyPend();
                await Toast.fire({
                    title: data?.message ?? "Company has been enlisted as pending.",
                    icon: "success"
                });
            },
            async (data, status) => {
                confirmPendOpen = false;
                
                await Toast.fire({
                    title: data?.message ?? "Unable to pend company.",
                    icon: "error"
                })
            },
        );
    }
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
    <HeadBar
        title={`Rejection Appeals - ${rejections.company.profile.name}`}
        BtnIcon={X}
        btnLabel={"Exit"}
        onBtnClick={onExitRejections}
    />
    <div class="max-h-[calc(100%-64px)] overflow-auto">
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
                            })} - {rejections.company.profile.name}</p>
                            {#if index === 0}
                                <Button
                                    title={`Mark ${rejections.company.profile.name} as pending?`}
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
                        <p class="text-sm text-gray-500 mt-3 mb-0">No appeal from {rejections.company.profile.name} yet.</p>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>
{#if confirmPendOpen}
    <ConfirmPopup
        confirmText={`Enlist ${rejections.company.profile.name} into pending companies?`}
        onConfirm={onPendConfirm}
        onCancel={onPendExit}
    />
{/if}