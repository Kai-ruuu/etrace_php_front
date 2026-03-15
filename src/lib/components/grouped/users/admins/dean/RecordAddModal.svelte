<script>
	import { API_BASE_URL } from "$lib/app/core/constants";
	import { CourseService } from "$lib/app/services/insti/course";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import FileField from "$lib/components/single/global/FileField.svelte";
	import NumberField from "$lib/components/single/global/NumberField.svelte";
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
        course_id: { value: 0, error: "" },
        graduate_record: { value: null, error: "" },
        graduation_year: { value: (new Date()).getFullYear(), error: "" }
    });

    onMount(async () => {
        await CourseService.allFromSchool(
            async (data) => {
                courses = data;
                coursesReady = true;

                if (courses.length > 0) {
                    record.course_id.value = courses[0].id;
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

            <div class="flex flex-col items-stretch">
                <span class="mb-2 text-sm">Course</span>
                <select
                    bind:value={record.course_id.value}
                    class="border rounded-lg py-3 border-gray-300"
                >
                    {#each courses as course}
                        <option value={course.id}>{course.name} {course.archived === 1 ? "- Archived" : ""}</option>
                    {/each}
                </select>
                {#if record.course_id.error}
                    <span class="text-red-500 text-sm">{record.course_id.error}</span>
                {/if}
            </div>

            <div class="flex flex-col items-stretch">
                <span class="mb-2 text-sm">Graduation Year</span>
                <NumberField
                    bind:value={record.graduation_year.value}
                    onDebounce={(value) => {
                        if (parseInt(value) > new Date().getFullYear()) {
                            record.graduation_year.error = "Graduation year is in the future.";
                        } else if (parseInt(value) < 2007) {
                            record.graduation_year.error = "Graduation year must be 2007 or later.";
                        } else {
                            record.graduation_year.error = "";
                        }
                    }}
                    placeholder="Graduation year"
                />
                {#if record.graduation_year.error}
                    <span class="text-red-500 text-sm">{record.graduation_year.error}</span>
                {/if}
            </div>
            <div class="flex flex-col items-stretch">
                <span class="mb-2 text-sm">Curriculum Vitae</span>
                <FileField
                    accept=".csv"
                    acceptMimes={["text/csv"]}
                    placeholder="Graduate Record (CSV)"
                    bind:value={record.graduate_record.value}
                    onUpload={(file, mimes) => record.graduate_record.error = !mimes.includes(file.type) ? "Unsupported file format." : ""}
                />
                {#if record.graduate_record.error}
                    <span class="text-red-500 text-sm">{record.graduate_record.error}</span>
                {/if}
            </div>
            <Button
                label="Add"
                onclick={async () => {
                    if (record.course_id.error || record.graduation_year.error || record.graduate_record.error || !record.graduate_record.value) {
                        await Toast.fire({
                            title: "Please fill in all required fields before submitting.",
                            icon: "error"
                        });
                        return;
                    }
                    
                    await onAddCommit({
                        course_id: record.course_id.value,
                        graduate_record: record.graduate_record.value,
                        graduation_year: record.graduation_year.value,
                    });
                }}
                class="bg-blue-500"
            />
            <hr class="border-t border-gray-200 mt-2">
            <span class="text-center">Don't have the template yet? Download it by clicking <a href={API_BASE_URL + "/public/template.csv"} class="underline text-blue-700">here</a></span>
        </div>
    </div>
{/if}