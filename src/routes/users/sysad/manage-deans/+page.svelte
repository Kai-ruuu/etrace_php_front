<script>
	import { SchoolService } from "$lib/app/services/insti/school";
	import { DeanService } from "$lib/app/services/users/dean";
	import { Toast } from "$lib/app/utils/swal";
	import DeanAddModal from "$lib/components/grouped/users/admins/sysad/DeanAddModal.svelte";
	import DeansList from "$lib/components/grouped/users/admins/sysad/DeansList.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import { onMount, untrack } from "svelte";

    let enabled = $state(true);
    let query = $state("");
	let addModalOpen = $state(false);
	let confirmEndisPopupOpen = $state(false);
	let confirmEndisPopupDean = $state(null);
	let schools = $state([]);
    let schoolId = $state(0);
	let schoolsLoaded = $state(false);
    let deansInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});
	let deansLoaded = $state(false);

    async function searchDeans() {
		deansLoaded = false;
		
        await DeanService.search(query, {
            page: deansInfo.page,
			perPage: deansInfo.perPage,
			schoolId,
			enabled,
			onSuccess: async (data, status) => {
                deansInfo = data;
				deansLoaded = true;
            },
			onFail: async (data, status) => {
				deansLoaded = true;
				await Toast.fire({
					title: data?.message ?? "Failed to get Deans.",
					icon: "error"
				});
			}
        });
    }

	async function onQueryClear() {
		query = "";
		deansInfo.page = 1;
		await searchDeans();
	}

	async function onConfirmEndis() {
		if (enabled) {
			await DeanService.disable(
				confirmEndisPopupDean,
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupDean = null;
	
					await searchDeans();
					await Toast.fire({
						title: data?.message ?? "Dean has been disabled.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupDean = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to disable dean.",
						icon: "error"
					})
				},
			)
		} else {
			await DeanService.enable(
				confirmEndisPopupDean,
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupDean = null;
	
					await searchDeans();
					await Toast.fire({
						title: data?.message ?? "Dean has been disabled.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupDean = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to enable dean.",
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

	async function onAddCommit(dean) {
		await DeanService.create(
			dean,
			async (data, status) => {
				addModalOpen = false;
				await searchDeans();
				await Toast.fire({
					title: data?.message ?? "Dean has been created.",
					icon: "success",
				})
			},
			async (data, status) => {
				addModalOpen = false;
				await Toast.fire({
					title: data?.message ?? "Failed to create dean.",
					icon: "error",
				})
			},
		);
	}

	async function onSearch() {
		deansInfo.page = 1;
		await searchDeans();
	}

	async function onEnable(dean) {
		confirmEndisPopupOpen = true;
		confirmEndisPopupDean = dean;
	}

	async function onDisable(dean) {
		confirmEndisPopupOpen = true;
		confirmEndisPopupDean = dean;
	}

	async function onPrev() {
		if (deansInfo.has_prev) {
			deansInfo.page--;
			await searchDeans();
		}
	}

	async function onNext() {
		if (deansInfo.has_next) {
			deansInfo.page++;
			await searchDeans();
		}
	}

    onMount(async () => {
		await SchoolService.all(
			async (data, status) => {
				schools = data;

				if (data.length > 0) {
					schoolId = schools[0].id;
				}

				schoolsLoaded = true;
			},
			async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Failed to get schools.",
					icon: "error"
				})
			},
		)
	});
	$effect(() => {
		if (schoolsLoaded) {
			untrack(() => searchDeans());
		}
	})
</script>

<DeansList
	bind:query={query}
	bind:schoolId={schoolId}
	{schools}
	{onAdd}
	{onQueryClear}
	bind:enabled={enabled}
	{deansInfo}
	{deansLoaded}
	{onSearch}
	{onEnable}
	{onDisable}
	{onPrev}
	{onNext}
/>
{#if confirmEndisPopupOpen}
	<ConfirmPopup
		confirmText={`${enabled ? "Disable" : "Enable"} ${confirmEndisPopupDean.email}?`}
		onConfirm={onConfirmEndis}
		onCancel={onCancelEndis}
	/>
{/if}
{#if addModalOpen}
	<DeanAddModal
		onExit={onAddModalExit}
		onAddCommit={onAddCommit}
	/>
{/if}