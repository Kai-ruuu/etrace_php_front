<script>
	import { CourseService } from "$lib/app/services/insti/course";
	import { CompanyService } from "$lib/app/services/users/company";
	import { user } from "$lib/app/stores/user";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { Building2, Check, CircleCheck, Edit, Key, Pen, Plus, Trash, Upload, X } from "lucide-svelte";
	import { onMount } from "svelte";

    let {
        onExit,
        onSearch
    } = $props();

    let post = $state({
        position:        { value: "", error: "" },
        description:     { value: "", error: "" },
        qualifications:    { value: [], error: "" },
        address:         { value: "", error: "" },
        salary_min:      { value: 0, error: "" },
        salary_max:      { value: 0, error: "" },
        work_shift:      { value: "Day", error: "" },
        work_setup:      { value: "On-site", error: "" },
        employment_type: { value: "Full-time", error: "" },
        slots:           { value: 1, error: "" },
        additional_info: { value: "", error: "" },
        open_until:      { value: null, error: "" },
        target_courses: []
    });
    let newQualification = $state("");
    let editQuali = $state("");
    let editQualiOn = $state(false);
    let editQualiIndex = $state(null);
    let courses = $state([]);
    let coursesReady = $state(false);

    function isPostValid() {
        let noErrors = true;

        if (post.position.value.trim().length === 0) {
            noErrors = false;
            post.position.error = "Position required.";
        }
        if (post.description.value.trim().length === 0) {
            noErrors = false;
            post.description.error = "Description required.";
        }
        if (post.qualifications.value.length === 0) {
            noErrors = false;
            post.qualifications.error = "At least 1 qualification is required.";
        }
        if (post.address.value.trim().length === 0) {
            noErrors = false;
            post.address.error = "Address is required.";
        }
        if (post.salary_min.value <= 0) {
            noErrors = false;
            post.salary_min.error = "Minimum salary is required.";
        }
        if (post.salary_min.value > post.salary_max.value) {
            noErrors = false;
            post.salary_min.error = "Minimum salary should be lower than the maximum salary.";
        }
        if (post.salary_max.value <= 0) {
            noErrors = false;
            post.salary_max.error = "Maximum salary is required.";
        }
        if (post.salary_max.value < post.salary_min.value) {
            noErrors = false;
            post.salary_max.error = "Maximum salary should be higher than the minimum salary.";
        }
        if (post.slots.value <= 0) {
            noErrors = false;
            post.slots.error = "There should be at least 1 available slot for the position.";
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(post.open_until.value);

        if (selectedDate < today) {
            noErrors = false;
            post.open_until.error = "Date is in the past.";
        }
        
        return noErrors;
    }
    
    async function onPost() {
        if (!isPostValid()) {
            await Toast.fire({
                title: "Complete all fields to continue.",
                icon: "warning"
            })
            return;
        }

        if (!coursesReady) {
            await Toast.fire({
                title: "Courses are not loaded yet.",
                icon: "warning"
            })
            return;
        }

        if (post.target_courses.length === 0) {
            await Toast.fire({
                title: "At least one target course is required.",
                icon: "warning"
            })
            return;
        }

        let formattedPost = {};

        Object.entries(post).forEach(([key, value]) => {
            if (key === "qualifications") {
                formattedPost["qualifications"] = JSON.stringify(value.value);
                return;
            }
            
            if (key === "target_courses") {
                formattedPost["target_courses"] = value;
            } else {
                formattedPost[key] = value.value;
            }
        });

        await CompanyService.postJob(
            formattedPost,
            async (data, stat) => {
                onExit();
                await onSearch();
                await Toast.fire({
                    title: data?.message ?? "Job post has been created.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to post job.",
                    icon: "error"
                });
            },
        );
    }

    onMount(async () => {
        // set default address value
        post.address.value = $user.profile.address;

        // set default open until value
        const now = new Date();
        now.setDate(now.getDate() + 30);
        const in30Days = now.toISOString().split('T')[0];
        post.open_until.value = in30Days;

        // fetch courses
        await CourseService.allActive(
            async (data, stat) => {
                courses = data;
                coursesReady = true;
            },
            async (data, stat) => {
                await Toast.fire({
                    title: data?.message ?? "Failed to get courses.",
                    icon: "error"
                });
            },
        );
    });
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white p-6 gap-y-4 md:w-1/2">
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-lg">New Job Post</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>

        <div class="space-y-4">
            <div class="w-full space-y-1">
                <p class="text-sm text-gray-500">Position</p>
                <TextField
                    bind:value={post.position.value}
                    placeholder="Enter position"
                />
                {#if post.position.error}
                    <p class="text-red-500 text-sm">{post.position.error}</p>
                {/if}
            </div>
            <div class="w-full space-y-1">
                <p class="text-sm text-gray-500">Description</p>
                <textarea
                    placeholder="Enter position's description"
                    bind:value={post.description.value}
                    class="border border-gray-300 rounded-lg px-6 py-3 w-full"
                ></textarea>
                {#if post.description.error}
                    <p class="text-red-500 text-sm">{post.description.error}</p>
                {/if}
            </div>
            <div>
                <p class="text-sm text-gray-500">Qualifications</p>
                {#if post.qualifications.error}
                    <p class="text-red-500 text-sm">{post.qualifications.error}</p>
                {/if}
                {#if post.qualifications.value.length > 0}
                    <div class="pt-2">
                        {#each post.qualifications.value as req, index}
                            <div class="flex items-center gap-x-4 mb-2">
                                <div class="flex items-center gap-x-2 grow">
                                    {#if (editQualiOn && editQualiIndex === index)}
                                        <input
                                            type="text"
                                            class="border border-gray-300 rounded-lg grow"
                                            bind:value={editQuali}
                                        >
                                    {:else}
                                        <CircleCheck class="min-w-4 max-w-4"/>
                                        <span>{req}</span>
                                    {/if}
                                </div>
                                <div class="flex items-center justify-end gap-x-2">
                                    {#if (editQualiOn && editQualiIndex === index)}
                                        <Button
                                            Icon={Check}
                                            size="s"
                                            onclick={() => {
                                                if (editQuali.trim().length === 0) {
                                                    // err here
                                                    return;
                                                }
                                                
                                                post.qualifications.value[index] = editQuali;
                                                editQuali = "";
                                                editQualiOn = false;
                                                editQualiIndex = null;
                                            }}
                                            class="bg-green-500"
                                        />
                                        <Button
                                            Icon={X}
                                            size="s"
                                            onclick={() => {
                                                editQuali = "";
                                                editQualiOn = false;
                                                editQualiIndex = null;
                                            }}
                                            class="bg-red-500"
                                        />
                                    {:else}
                                        <Button
                                            Icon={Pen}
                                            size="s"
                                            onclick={() => {
                                                editQuali = post.qualifications.value[index];
                                                editQualiOn = true;
                                                editQualiIndex = index;
                                            }}
                                            class="bg-blue-500"
                                        />
                                        <Button
                                            Icon={Trash}
                                            size="s"
                                            onclick={() => post.qualifications.value = post.qualifications.value.filter((_, i) => i !== index)}
                                            class="bg-red-500"
                                        />
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
                <TextField
                    bind:value={newQualification}
                    placeholder="Enter a qualification"
                    BtnIcon={Plus}
                    btnLabel="Add"
                    btnOnclick={() => {
                        if (newQualification.trim().length === 0) {
                            // err here
                            return;
                        }
                        
                        if (!post.qualifications.value.includes(newQualification.trim())) {
                            post.qualifications.value.push(newQualification.trim());
                            newQualification = "";
                        } else {
                            // err here
                        }
                    }}
                    class="mt-1"
                />
            </div>
            <div class="w-full space-y-1">
                <p class="text-sm text-gray-500">Address</p>
                <TextField
                    bind:value={post.address.value}
                    placeholder="Enter address"
                />
                {#if post.address.error}
                    <p class="text-red-500 text-sm">{post.address.error}</p>
                {/if}
            </div>
            <div class="grid grid-cols-2 gap-x-6">
                <div class="space-y-1">
                    <p class="text-sm text-gray-500">Minimum Salary</p>
                    <input
                        type="number"
                        bind:value={post.salary_min.value}
                        class="px-6 py-3 border border-gray-300 rounded-lg w-full"
                    />
                    {#if post.salary_min.error}
                        <p class="text-red-500 text-sm">{post.salary_min.error}</p>
                    {/if}
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-gray-500">Maximum Salary</p>
                    <input
                        type="number"
                        bind:value={post.salary_max.value}
                        class="px-6 py-3 border border-gray-300 rounded-lg w-full"
                    />
                    {#if post.salary_max.error}
                        <p class="text-red-500 text-sm">{post.salary_max.error}</p>
                    {/if}
                </div>
            </div>
            <div class="grid grid-cols-2 gap-x-6">
                <div class="space-y-1">
                    <p class="text-sm text-gray-500">Work Shift</p>
                    <select
                        bind:value={post.work_shift.value}
                        class="px-6 py-3 border border-gray-300 rounded-lg w-full"
                    >
                        <option value="Day">Day</option>
                        <option value="Evening / Swing">Evening / Swing</option>
                        <option value="Night / Graveyard">Night / Graveyard</option>
                        <option value="Morning">Mornin</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-gray-500">Work Setup</p>
                    <select
                        bind:value={post.work_setup.value}
                        class="px-6 py-3 border border-gray-300 rounded-lg w-full"
                    >
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>
            </div>
            <div class="flex items-center gap-x-6">
                <div class="space-y-1 grow">
                    <p class="text-sm text-gray-500">Employment Type</p>
                    <select
                        bind:value={post.employment_type.value}
                        class="px-6 py-3 border border-gray-300 rounded-lg w-full"
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                    </select>
                </div>
                <div class="space-y-1 max-w-1/5">
                    <p class="text-sm text-gray-500">Slots</p>
                    <input
                        min="1"
                        type="number"
                        bind:value={post.slots.value}
                        class="px-6 py-3 border border-gray-300 rounded-lg w-full"
                    >
                    {#if post.slots.error}
                        <p class="text-red-500 text-sm">{post.slots.error}</p>
                    {/if}
                </div>
            </div>
            <div class="w-full space-y-1">
                <p class="text-sm text-gray-500">Additional Information (optional)</p>
                <textarea
                    placeholder="Enter additional information"
                    bind:value={post.additional_info.value}
                    class="border border-gray-300 rounded-lg px-6 py-3 w-full"
                ></textarea>
            </div>
            <div class="w-full space-y-1">
                <p class="text-sm text-gray-500">Open Until</p>
                <input
                    type="date"
                    bind:value={post.open_until.value}
                    class="border border-gray-300 rounded-lg px-6 py-3 w-full"
                >
                {#if post.open_until.error}
                    <p class="text-red-500 text-sm">{post.open_until.error}</p>
                {/if}
            </div>
            <div class="w-full">
                <p class="text-sm text-gray-500 mb-1">Target Courses</p>
                <div class="min-h-60 min-h-60 overflow-x-hidden overflow-y-auto border border-gray-200 rounded-lg px-6 py-3 space-y-2">
                    {#each courses as course}
                        <div class="w-full flex items-center justify-between gap-x-4">
                            <p class="truncate">{course.name}</p>
                            {#if post.target_courses.includes(course.id)}
                                <Button
                                    Icon={X}
                                    size="s"
                                    onclick={() => post.target_courses = post.target_courses.filter((c) => c !== course.id)}
                                    class="bg-red-500"
                                />
                            {:else}
                                <Button
                                    Icon={Plus}
                                    size="s"
                                    onclick={() => post.target_courses.push(course.id)}
                                    class="bg-green-500"
                                />
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
            <Button
                Icon={Upload}
                label="Post"
                onclick={onPost}
                class="bg-green-500 w-full"
            />
        </div>
    </div>
</div>