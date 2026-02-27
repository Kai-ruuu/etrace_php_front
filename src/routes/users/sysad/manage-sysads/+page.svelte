<script>
	import { SysadService } from "$lib/app/services/users/sysad";
	import { Toast } from "$lib/app/utils/swal";
	import SysadAddModal from "$lib/components/grouped/users/admins/sysad/SysadAddModal.svelte";
	import SysadsList from "$lib/components/grouped/users/admins/sysad/SysadsList.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import { onMount } from "svelte";

    let enabled = $state(true);
    let query = $state("");
	let addModalOpen = $state(false);
	let confirmEndisPopupOpen = $state(false);
	let confirmEndisPopupSysad = $state(null);
    let sysadsInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});

    async function searchSysads() {
        await SysadService.search(query, {
            page: sysadsInfo.page,
			perPage: sysadsInfo.perPage,
			enabled,
			onSuccess: async (data, status) => {
                sysadsInfo = data;
            },
			onFail: async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Failed to get system administrators.",
					icon: "error"
				});
			}
        });
    }

	async function onQueryClear() {
		query = "";
		sysadsInfo.page = 1;
		await searchSysads();
	}

	async function onConfirmEndis() {
		if (enabled) {
			await SysadService.disable(
				confirmEndisPopupSysad,
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupSysad = null;
	
					await searchSysads();
					await Toast.fire({
						title: data?.message ?? "System administrator has been disabled.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupSysad = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to disable system administrator.",
						icon: "error"
					})
				},
			)
		} else {
			await SysadService.enable(
				confirmEndisPopupSysad,
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupSysad = null;
	
					await searchSysads();
					await Toast.fire({
						title: data?.message ?? "System administrator has been disabled.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupSysad = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to enable system administrator.",
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

	async function onAddCommit(sysad) {
		await SysadService.create(
			sysad,
			async (data, status) => {
				addModalOpen = false;
				await searchSysads();
				await Toast.fire({
					title: data?.message ?? "System Administrator has been created.",
					icon: "success",
				})
			},
			async (data, status) => {
				addModalOpen = false;
				await Toast.fire({
					title: data?.message ?? "Failed to create system administrator.",
					icon: "error",
				})
			},
		);
	}

	async function onSearch() {
		sysadsInfo.page = 1;
		await searchSysads();
	}

	async function onEnable(sysad) {
		confirmEndisPopupOpen = true;
		confirmEndisPopupSysad = sysad;
	}

	async function onDisable(sysad) {
		confirmEndisPopupOpen = true;
		confirmEndisPopupSysad = sysad;
	}

	async function onPrev() {
		if (sysadsInfo.has_prev) {
			sysadsInfo.page--;
			await searchSysads();
		}
	}

	async function onNext() {
		if (sysadsInfo.has_next) {
			sysadsInfo.page++;
			await searchSysads();
		}
	}

    onMount(searchSysads);
</script>

<SysadsList
	bind:query={query}
	{onAdd}
	{onQueryClear}
	bind:enabled={enabled}
	{sysadsInfo}
	{onSearch}
	{onEnable}
	{onDisable}
	{onPrev}
	{onNext}
/>
{#if confirmEndisPopupOpen}
	<ConfirmPopup
		confirmText={`${enabled ? "Disable" : "Enable"} ${confirmEndisPopupSysad.email}?`}
		onConfirm={onConfirmEndis}
		onCancel={onCancelEndis}
	/>
{/if}
{#if addModalOpen}
	<SysadAddModal
		onExit={onAddModalExit}
		onAddCommit={onAddCommit}
	/>
{/if}