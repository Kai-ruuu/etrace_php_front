<script>
	import { PstaffService } from "$lib/app/services/users/pstaff";
	import { Toast } from "$lib/app/utils/swal";
	import PstaffAddModal from "$lib/components/grouped/users/admins/sysad/PstaffAddModal.svelte";
	import PstaffsList from "$lib/components/grouped/users/admins/sysad/PstaffsList.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import { onMount } from "svelte";

    let enabled = $state(true);
    let query = $state("");
	let addModalOpen = $state(false);
	let confirmEndisPopupOpen = $state(false);
	let confirmEndisPopupPstaff = $state(null);
    let pstaffsInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});

    async function searchPstaffs() {
        await PstaffService.search(query, {
            page: pstaffsInfo.page,
			perPage: pstaffsInfo.perPage,
			enabled,
			onSuccess: async (data, status) => {
                pstaffsInfo = data;
            },
			onFail: async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Failed to get peso staffs.",
					icon: "error"
				});
			}
        });
    }

	async function onQueryClear() {
		query = "";
		pstaffsInfo.page = 1;
		await searchPstaffs();
	}

	async function onConfirmEndis() {
		if (enabled) {
			await PstaffService.disable(
				confirmEndisPopupPstaff,
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupPstaff = null;
	
					await searchPstaffs();
					await Toast.fire({
						title: data?.message ?? "PESO Staff has been disabled.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupPstaff = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to disable peso staff.",
						icon: "error"
					})
				},
			)
		} else {
			await PstaffService.enable(
				confirmEndisPopupPstaff,
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupPstaff = null;
	
					await searchPstaffs();
					await Toast.fire({
						title: data?.message ?? "PESO Staff has been disabled.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupPstaff = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to enable peso staff.",
						icon: "error"
					})
				},
			)
		}
	}

	async function onCancelEndis() {
		confirmEndisPopupOpen = false;
	}
	
	async function onAdd() {
		addModalOpen = true;
	}

	function onAddModalExit() {
		addModalOpen = false;
	}

	async function onAddCommit(pstaff) {
		await PstaffService.create(
			pstaff,
			async (data, status) => {
				addModalOpen = false;
				await searchPstaffs();
				await Toast.fire({
					title: data?.message ?? "PESO Staff has been created.",
					icon: "success",
				})
			},
			async (data, status) => {
				addModalOpen = false;
				await Toast.fire({
					title: data?.message ?? "Failed to create peso staff.",
					icon: "error",
				})
			},
		);
	}

	async function onSearch() {
		pstaffsInfo.page = 1;
		await searchPstaffs();
	}

	async function onEnable(pstaff) {
		confirmEndisPopupOpen = true;
		confirmEndisPopupPstaff = pstaff;
	}

	async function onDisable(pstaff) {
		confirmEndisPopupOpen = true;
		confirmEndisPopupPstaff = pstaff;
	}

	async function onPrev() {
		if (pstaffsInfo.has_prev) {
			pstaffsInfo.page--;
			await searchPstaffs();
		}
	}

	async function onNext() {
		if (pstaffsInfo.has_next) {
			pstaffsInfo.page++;
			await searchPstaffs();
		}
	}

    onMount(searchPstaffs);
</script>

<PstaffsList
	bind:query={query}
	{onAdd}
	{onQueryClear}
	bind:enabled={enabled}
	{pstaffsInfo}
	{onSearch}
	{onEnable}
	{onDisable}
	{onPrev}
	{onNext}
/>
{#if confirmEndisPopupOpen}
	<ConfirmPopup
		confirmText={`${enabled ? "Disable" : "Enable"} ${confirmEndisPopupPstaff.email}?`}
		onConfirm={onConfirmEndis}
		onCancel={onCancelEndis}
	/>
{/if}
{#if addModalOpen}
	<PstaffAddModal
		onExit={onAddModalExit}
		onAddCommit={onAddCommit}
	/>
{/if}