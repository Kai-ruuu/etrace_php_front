<script>
	import { SchoolService } from "$lib/app/services/insti/school";
	import { Toast } from "$lib/app/utils/swal";
	import HeadBar from "$lib/components/grouped/users/admins/HeadBar.svelte";
	import SchoolsList from "$lib/components/grouped/users/admins/sysad/SchoolsList.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import { Archive, ArchiveRestore, Pen, Search } from "lucide-svelte";
	import { onMount } from "svelte";
	import { page } from '$app/stores';

	let archived = true;
	let confirmArcresPopupOpen = $state(false);
	let confirmArcresPopupSchool = $state(null);
	let query = $state("");
	let schoolsInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});

	async function searchSchools() {
		await SchoolService.search(query, {
			page: schoolsInfo.page,
			perPage: schoolsInfo.perPage,
			archived,
			onSuccess: async (data, status) => schoolsInfo = data,
			onFail: async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Failed to get schools.",
					icon: "error"
				});
			}
		});
	}

	async function onQueryClear() {
		query = "";
		schoolsInfo.page = 1;
		await searchSchools();
	}

	async function onConfirmArcres() {
		if (archived) {
			await SchoolService.restore(
				confirmArcresPopupSchool,
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupSchool = null;
	
					await searchSchools();
					await Toast.fire({
						title: data?.message ?? "School has been restored.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupSchool = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to restore school.",
						icon: "error"
					})
				},
			)
		} else {
			await SchoolService.archive(
				confirmArcresPopupSchool,
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupSchool = null;
	
					await searchSchools();
					await Toast.fire({
						title: data?.message ?? "School has been archived.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupSchool = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to archive school.",
						icon: "error"
					})
				},
			)
		}
	}

	async function onCancelArcres() {
		confirmArcresPopupOpen = false;
	}
	
	async function onSearch() {
		schoolsInfo.page = 1;
		await searchSchools();
	}

	async function onArchive(school) {
		confirmArcresPopupOpen = true;
		confirmArcresPopupSchool = school;
	}

	async function onRestore(school) {
		confirmArcresPopupOpen = true;
		confirmArcresPopupSchool = school;
	}

	async function onPrev() {
		if (schoolsInfo.has_prev) {
			schoolsInfo.page--;
			await searchSchools();
		}
	}

	async function onNext() {
		if (schoolsInfo.has_next) {
			schoolsInfo.page++;
			await searchSchools();
		}
	}

	onMount(searchSchools);
</script>

<SchoolsList
	bind:query={query}
	onAdd={() => {}}
	{onQueryClear}
	{archived}
	{schoolsInfo}
	{onSearch}
	onEdit={() => {}}
	{onArchive}
	{onRestore}
	{onPrev}
	{onNext}
/>
{#if confirmArcresPopupOpen}
	<ConfirmPopup
		confirmText={`${archived ? "Restore" : "Archive"} ${confirmArcresPopupSchool.name}?`}
		onConfirm={onConfirmArcres}
		onCancel={onCancelArcres}
	/>
{/if}