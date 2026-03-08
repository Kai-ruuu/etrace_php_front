<script>
	import { CourseService } from "$lib/app/services/insti/course";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import FileField from "$lib/components/single/global/FileField.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { Plus, X } from "lucide-svelte";
	import { onMount } from "svelte";

    let {
        onAddCommit,
        onExit
    } = $props();

    let courses = $state([]);
    let coursesReady = $state(false);
    let record = $state({
        course_id: 0,
        graduate_record: null
    });

    onMount(async () => {
        await CourseService.allFromSchool(
            async (data) => {
                courses = data;
                coursesReady = true;

                if (courses.length > 0) {
                    record.course_id = courses[0].id;
                }
            },
            async (data) => {
                await Toast.fire({
                    title: data?.message ?? "Failed to get courses."
                });
            },
        );
    })
</script>

{#if coursesReady}
    <div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center p-8">
        <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 mt-8 md:w-1/3">
            <div class="flex items-center justify-between">
                <h1 class="text-lg">Add Record</h1>
                <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
            </div>
            <select
                bind:value={record.course_id}
                class="border rounded-lg py-3 border-gray-300"
            >
                {#each courses as course}
                    <option value={course.id}>{course.name} {course.archived === 1 ? "- Archived" : ""}</option>
                {/each}
            </select>
            <FileField
                accept=".csv"
                placeholder="Graduate Record (CSV)"
                bind:value={record.graduate_record}
            />
            <Button
                label="Add"
                onclick={async () => await onAddCommit(record)}
                class="bg-blue-500"
            />
        </div>
    </div>
{/if}