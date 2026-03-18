<script>
	import { SchoolService } from "$lib/app/services/insti/school";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import EmailField from "$lib/components/single/global/EmailField.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { Plus, X } from "lucide-svelte";
	import { onMount } from "svelte";

    let {
        onAddCommit,
        onExit
    } = $props();

    let schools = $state([]);
    let dean = $state({
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        school_id: 0,
    });

    onMount(async () => await SchoolService.allActive(
        async (data, status) => {
            schools = data;

            if (data.length > 0) {
                dean.school_id = schools[0].id;
            }
        },
        async (data, status) => {
            await Toast.fire({
                title: data?.message ?? "Failed to get schools.",
                icon: "error"
            })
        },
    ));
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 mt-8 md:w-1/3">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">Add Dean</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        <EmailField
            bind:value={dean.email}
            placeholder="Email"
        />
        <TextField
            bind:value={dean.first_name}
            placeholder="First Name"
        />
        <TextField
            bind:value={dean.middle_name}
            placeholder="Middle Name"
            required={false}
        />
        <TextField
            bind:value={dean.last_name}
            placeholder="Last Name"
        />
        <select
            bind:value={dean.school_id}
            class="border border-gray-300 rounded-lg px-6 py-3"
        >
            {#each schools as school}
                <option value={school.id}>{school.name}</option>
            {/each}
        </select>
        <Button
            label="Add"
            onclick={async () => await onAddCommit(dean)}
            class="bg-blue-500"
        />
    </div>
</div>