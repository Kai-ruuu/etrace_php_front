<script>
	import { BookX, X } from "lucide-svelte";
	import HeadBar from "../HeadBar.svelte";
	import { onMount } from "svelte";
	import { RecordService } from "$lib/app/services/insti/record";
	import { Toast } from "$lib/app/utils/swal";
    import Papa from "papaparse";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { capitalizeWords, highlight } from "$lib/app/utils/output";

    let {
        openedRecord,
        onRecordClose
    } = $props();

    let query = $state("");
    let content = $state(null);
    let results = $derived(
        content.data !== undefined
        ? content.data.filter((alumni) => {
            return (
                String(alumni["First Name"]).toLowerCase().includes(query.trim().toLowerCase()) ||
                String(alumni["Middle Name"]).toLowerCase().includes(query.trim().toLowerCase()) ||
                String(alumni["Last Name"]).toLowerCase().includes(query.trim().toLowerCase()) ||
                String(alumni["Birthdate"]).toLowerCase().includes(query.trim().toLowerCase()) ||
                String(alumni["Birthplace"]).toLowerCase().includes(query.trim().toLowerCase()) ||
                String(alumni["Gender"]).toLowerCase().includes(query.trim().toLowerCase()) ||
                String(alumni["Student Number"]).toLowerCase().includes(query.trim().toLowerCase()) ||
                String(alumni["Contact Number"]).toLowerCase().includes(query.trim().toLowerCase())
            );
        }).sort((a, b) => String(a["First Name"]).localeCompare(String(b["First Name"])))
        : []
    );

    function onQueryClear() {
        query = "";
    }

    onMount(async () => {
        await RecordService.open(
            openedRecord,
            async (data, status) => {
                content = Papa.parse(data.content, {
                    header: true,
                    skipEmptyLines: true,
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Failed to open record.",
                    icon: "error"
                });
            },
        )
    })
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
    <HeadBar
        title={openedRecord.filename}
        BtnIcon={X}
        btnLabel={"Close"}
        onBtnClick={onRecordClose}
    />
    {#if content}
        <div class="max-h-[calc(100%-64px)] overflow-auto">
            <div class="px-6 min-w-max">
                <div class="border border-gray-200 rounded-lg bg-white space-y-2 overflow-clip my-6 pb-6">
                    <div class="sticky top-0 left-0 px-6 bg-white pt-6 flex items-center gap-x-2 z-20 overflow-clip">
                        <TextField
                            bind:value={query}
                            placeholder="Search alumni information",
                            allowClear={true}
                            onClear={onQueryClear}
                            class="grow"
                        />
                    </div>
                    {#if results.length > 0}
                        <div class="px-6">
                            <table>
                                <thead>
                                    <tr class="sticky top-18 left-0">
                                        <th class="bg-white text-left text-nowrap py-2">First Name</th>
                                        <th class="bg-white text-left text-nowrap pl-4 py-2">Middle Name</th>
                                        <th class="bg-white text-left text-nowrap pl-4 py-2">Last Name</th>
                                        <th class="bg-white text-left text-nowrap pl-4 py-2">Birthdate</th>
                                        <th class="bg-white text-left text-nowrap pl-4 py-2">Birthplace</th>
                                        <th class="bg-white text-left text-nowrap pl-4 py-2">Gender</th>
                                        <th class="bg-white text-left text-nowrap pl-4 py-2">Student Number</th>
                                        <th class="bg-white text-left text-nowrap pl-4 py-2">Contact Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each results as alumni}
                                        <tr>
                                            <td class="text-nowrap">{@html highlight(capitalizeWords(alumni["First Name"]), query)}</td>
                                            <td class="text-nowrap pl-4 py-2">{@html highlight((alumni["Middle Name"] && alumni["Middle Name"] !== "N/A") ? capitalizeWords(alumni["Middle Name"]) : "-", query)}</td>
                                            <td class="text-nowrap pl-4 py-2">{@html highlight(capitalizeWords(alumni["Last Name"]), query)}</td>
                                            <td class="text-nowrap pl-4 py-2">{@html highlight(capitalizeWords(alumni["Birthdate"]), query)}</td>
                                            <td class="text-nowrap pl-4 py-2">{@html highlight(capitalizeWords(alumni["Birthplace"]), query)}</td>
                                            <td class="text-nowrap pl-4 py-2">{@html highlight(capitalizeWords(alumni["Gender"]), query)}</td>
                                            <td class="text-nowrap pl-4 py-2">{@html highlight(capitalizeWords(alumni["Student Number"]), query)}</td>
                                            <td class="text-nowrap pl-4 py-2">{@html highlight(capitalizeWords(alumni["Contact Number"]), query)}</td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    {:else}
                        <div class="p-6 pb-0 pt-4 flex items-center gap-x-2">
                            <BookX class="w-5"/>
                            <span>No results.</span>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>