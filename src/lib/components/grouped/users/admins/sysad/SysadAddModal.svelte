<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import EmailField from "$lib/components/single/global/EmailField.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { Plus, X } from "lucide-svelte";
	import { onMount } from "svelte";

    let {
        onAddCommit,
        onExit
    } = $props();

    let sysad = $state({
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
    });
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 mt-8 md:w-1/3">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">Add System Administrator</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        <EmailField
            bind:value={sysad.email}
            placeholder="Email"
        />
        <TextField
            bind:value={sysad.first_name}
            placeholder="First Name"
        />
        <TextField
            bind:value={sysad.middle_name}
            placeholder="Middle Name"
            required={false}
        />
        <TextField
            bind:value={sysad.last_name}
            placeholder="Last Name"
        />
        <Button
            label="Add"
            onclick={async () => await onAddCommit(sysad)}
            class="bg-blue-500"
        />
    </div>
</div>