<script>
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import { Briefcase, Calendar1, Check, DollarSign, MapPin, Monitor, Scroll, SunMoon, Users, X } from "lucide-svelte";
	import { onMount } from "svelte";

    let {
        jobPost,
        onExit
    } = $props();
    let post = $state(null);

    onMount(async () => {
        await AlumniService.getFullPostById(
            jobPost.job_post.id,
            async (data, stat) => {
                post = data;
                console.log(post.id);
            },
            async (data, stat) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to get the job post's information.",
                    icon: "error"
                })
                onExit();
            },
        )
    });
</script>

{#if post}
    <div class="fixed top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center p-8 z-100">
        <div class="border border-gray-200 rounded-lg bg-white pb-0 gap-y-4 md:w-1/2 relative">
            <div class="px-6 py-4 rounded-lg space-y-4 bg-white">
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
                    <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
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
            </div>
        </div>
    </div>
{/if}