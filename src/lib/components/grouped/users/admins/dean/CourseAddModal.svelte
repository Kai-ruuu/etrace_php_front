<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { Plus, X } from "lucide-svelte";
	import { onMount } from "svelte";

    let {
        onAddCommit,
        onExit
    } = $props();

    let course = $state({
        name: "",
        code: ""
    });
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 mt-8 md:w-1/3">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">Add Course</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        <TextField
            bind:value={course.name}
            placeholder="Course Name"
        />
        <TextField
            bind:value={course.code}
            placeholder="Course Code"
        />
        <Button
            label="Add"
            onclick={async () => await onAddCommit(course)}
            class="bg-blue-500"
        />
    </div>
</div>