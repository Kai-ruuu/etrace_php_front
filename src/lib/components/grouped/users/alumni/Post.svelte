<script>
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { user } from "$lib/app/stores/user";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import { Book, Briefcase, Calendar1, Check, ChevronDown, ChevronRight, DollarSign, EllipsisVertical, File, MapPin, Monitor, Scroll, SunMoon, ThumbsUp, Upload, Users, X } from "lucide-svelte";
	import { twMerge } from "tailwind-merge";

    let {
        post = $bindable(null)
    } = $props();
    let collapsed = $state(false);
    let submitConfirmOn = $state(false);

    async function onSubmitCv() {
        await AlumniService.submitCv(post.id,
            async (data, status) => {
                submitConfirmOn = false;
                post.submissions++;
                post.is_submitted = true;
                await Toast.fire({
                    title: data?.message ?? "CV submitted.",
                    icon: "success"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to submit CV.",
                    icon: "error"
                });
            },
        )
    }

    function onCancelConfirmSubmission() {
        submitConfirmOn = false;
    }

    async function onCancelSubmission() {
        await AlumniService.cancelCvSubmission(post.id,
            async (data, status) => {
                post.submissions--;
                post.is_submitted = false;
                await Toast.fire({
                    title: data?.message ?? "Submission canceled.",
                    icon: "success"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to cancel submission.",
                    icon: "error"
                });
            },
        )
    }

    async function onToggleLike() {
        if (post.is_liked) {
            await AlumniService.dislike(post.id,
                async (data, status) => {
                    post.likes--;
                    post.is_liked = false;
                },
                async (data, status) => {
                    await Toast.fire({
                        title: data?.message ?? "Unable to dislike post.",
                        icon: "error"
                    });
                },
            );
        } else {
            await AlumniService.like(post.id,
                async (data, status) => {
                    post.likes++;
                    post.is_liked = true;
                },
                async (data, status) => {
                    await Toast.fire({
                        title: data?.message ?? "Unable to like post.",
                        icon: "error"
                    });
                },
            );
        }
    }
</script>

<div class="px-6 py-4 rounded-lg border border-gray-200 space-y-4 bg-white">
    <div class="w-full flex justify-between">
        <div class="grow flex items-center gap-x-2">
            <div
                style="background-image: url({API_BASE_URL + `/uploads/company/logo/${post.company.req_logo}`})"
                class="min-w-12 min-h-12 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
            ></div>
            <div class="flex flex-col">
                <h1 class="font-bold text-lg">{post.company.name}</h1>
                <p class="text-gray-600 text-sm">{new Date(post.created_at.split(" ")[0]).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                })}</p>
            </div>
        </div>
        <button
            class="cursor-pointer"
            onclick={() => collapsed = !collapsed}
        >
            {#if collapsed}
                <ChevronDown class="min-w-4 max-w-4"/>
            {:else}
                <ChevronRight class="min-w-4 max-w-4"/>
            {/if}
        </button>
    </div>

    <hr class="border-t border-gray-200">
    
    <!-- header -->
    <div class="w-full">
        <h1 class="flex items-center gap-x-2">
            <Briefcase class="min-w-4 max-w-4"/>
            <strong>{post.position}</strong>
        </h1>
        <div class="flex items-center gap-x-2">
            <Calendar1 class="min-w-4 max-w-4"/>
            <span>Until {new Date(post.open_until).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            })}</span>
        </div>
        <div class="flex items-center gap-x-2">
            <Users class="min-w-4 max-w-4"/>
            <span>{post.slots} vacancies</span>
        </div>
        <div class="flex items-center gap-x-2">
            <DollarSign class="min-w-4 max-w-4"/>
            <span>₱{post.salary_min} - ₱{post.salary_max}</span>
        </div>
    </div>

    <p class="text-justify">{post.description}</p>

    {#if collapsed}
        <div class="w-full pt-2">
            <p class="p-0 mb-2 text-gray-500">Qualifications:</p>
            <div class="w-full space-y-1">
                {#each JSON.parse(post.qualifications) as quali}
                    <div class="flex items-center gap-x-2">
                        <Check class="min-w-4 max-w-4"/>
                        <p>{quali}</p>
                    </div>
                {/each}
            </div>
        </div>

        <div class="w-full pt-2">
            <p class="p-0 mb-2 text-gray-500">Work Information:</p>
            <div class="w-full space-y-1">
                <div class="flex items-center gap-x-2">
                    <MapPin class="min-w-4 max-w-4"/>
                    <span>Address: {post.address}</span>
                </div>
                <div class="flex items-center gap-x-2">
                    <Scroll class="min-w-4 max-w-4"/>
                    <span>Employment Type: {post.employment_type}</span>
                </div>
                <div class="flex items-center gap-x-2">
                    <SunMoon class="min-w-4 max-w-4"/>
                    <span>Shift: {post.work_shift}</span>
                </div>
                <div class="flex items-center gap-x-2">
                    <Monitor class="min-w-4 max-w-4"/>
                    <span>Setup: {post.work_setup}</span>
                </div>
            </div>
        </div>

        {#if post.additional_info}
            <div class="w-full pt-2">
                <p class="p-0 mb-2 text-gray-500">Additional Information:</p>
                <p class="text-justify">{post.additional_info}</p>
            </div>
        {/if}
    {/if}

    <hr class="border-t border-gray-200">
    <div class="w-full flex justify-end">
        <button
            onclick={onToggleLike}
            class={twMerge("flex items-center gap-x-2 pr-4 cursor-pointer", post.is_liked && "text-blue-500")}
        >
            <ThumbsUp class="min-w-4 max-w-4"/>
            <span>{post.likes} {post.likes === 1 ? "Like" : "Likes"}</span>
        </button>
        {#if post.is_submitted}
            <Button
                Icon={X}
                label="Unsubmit CV"
                size="s"
                onclick={onCancelSubmission}
                class="bg-red-500"
            />
        {:else}
            <Button
                Icon={Upload}
                label="Submit CV"
                size="s"
                onclick={() => submitConfirmOn = true}
                class="bg-blue-500"
            />
        {/if}
    </div>
</div>

{#if submitConfirmOn}
    <ConfirmPopup
        confirmText="By submitting your CV, you acknowledge that the company will review it at their own pace. If they find you to be a good fit for the position, they may reach you out outside of E-trace (e.g., via email or phone). Submission does not guarantee an interview or immediate response."
        onCancel={onCancelConfirmSubmission}
        onConfirm={onSubmitCv}
        class="md:w-1/3 text-justify"
    />
{/if}