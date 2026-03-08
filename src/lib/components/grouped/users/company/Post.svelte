<script>
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { user } from "$lib/app/stores/user";
	import { Book, Briefcase, Calendar1, Check, ChevronDown, ChevronRight, DollarSign, EllipsisVertical, File, MapPin, Monitor, Scroll, SunMoon, ThumbsUp, Users } from "lucide-svelte";
	import { onMount } from "svelte";

    let { post } = $props();
    let collapsed = $state(false);

    onMount(() => console.log(post));
</script>

<div class="px-6 py-4 rounded-lg border border-gray-200 mx-6 space-y-4">
    <div class="w-full flex justify-between">
        <div class="grow flex items-center gap-x-2">
            <div
                style="background-image: url({API_BASE_URL + `/uploads/company/logo/${$user.profile.req_logo}`})"
                class="min-w-12 min-h-12 w-fit rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat border border-gray-300"
            ></div>
            <div class="flex flex-col">
                <h1 class="font-bold text-lg">{$user.profile.name}</h1>
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

        <div class="w-full pt-2">
            <p class="p-0 mb-2 text-gray-500">Target Courses:</p>
            {#each post.target_courses as course}
                <div class="flex items-center gap-x-2">
                    <Book class="min-w-4 max-w-4"/>
                    <span>{course.course_name}</span>
                </div>
            {/each}
        </div>
    {/if}

    <hr class="border-t border-gray-200">
    <div class="w-full flex justify-end gap-x-4">
        <div class="flex items-center gap-x-2 border-r border-gray-300 pr-4">
            <ThumbsUp class="min-w-4 max-w-4"/>
            <span>700 Likes</span>
        </div>
        <div class="flex items-center gap-x-2">
            <File class="min-w-4 max-w-4"/>
            <span>700 CV Submissions</span>
        </div>
    </div>
</div>