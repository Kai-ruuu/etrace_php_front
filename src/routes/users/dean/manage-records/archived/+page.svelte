<script>
	import { CourseService } from "$lib/app/services/insti/course";
	import { RecordService } from "$lib/app/services/insti/record";
	import { Toast } from "$lib/app/utils/swal";
	import RecordsList from "$lib/components/grouped/users/admins/dean/RecordsList.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import { onMount, untrack } from "svelte";

    let archived = true;
	let confirmArcresPopupOpen = $state(false);
	let confirmArcresPopupRecord = $state(null);
	let query = $state("");
    let recordsInfo = $state({
        data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
    });
	let courseId = $state(0);
	let coursesReady = $state(false);
	let courses = $state([]);

    async function searchRecords() {
        await RecordService.search(query, {
			page: recordsInfo.page,
			perPage: recordsInfo.perPage,
			archived,
            courseId,
			onSuccess: async (data, status) => {
                recordsInfo = data;
            },
			onFail: async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Failed to get graduate records.",
					icon: "error"
				});
			}
		})
    }

	async function onSearch() {
		recordsInfo.page = 1;
		await searchRecords();
	}

	async function onQueryClear() {
		query = "";
		recordsInfo.page = 1;
		await searchRecords();
	}

	async function onArchive(record) {
		confirmArcresPopupOpen = true;
		confirmArcresPopupRecord = record;
	}

	async function onRestore(record) {
		confirmArcresPopupOpen = true;
		confirmArcresPopupRecord = record;
	}

	async function onConfirmArcres() {
		if (archived) {
			await RecordService.restore(
				confirmArcresPopupRecord,
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupRecord = null;
	
					await searchRecords();
					await Toast.fire({
						title: data?.message ?? "Graduate record has been restored.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupRecord = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to restore graduate records.",
						icon: "error"
					})
				},
			)
		} else {
			await RecordService.archive(
				confirmArcresPopupRecord,
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupRecord = null;
	
					await searchRecords();
					await Toast.fire({
						title: data?.message ?? "Graduate record has been archived.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupRecord = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to archive graduate records.",
						icon: "error"
					})
				},
			)
		}
	}

	async function onCancelArcres() {
		confirmArcresPopupOpen = false;
	}
    
	async function onPrev() {
		if (recordsInfo.has_prev) {
			recordsInfo.page--;
			await searchRecords();
		}
	}

	async function onNext() {
		if (recordsInfo.has_next) {
			recordsInfo.page++;
			await searchRecords();
		}
	}
	
    onMount(async () => await CourseService.allFromSchool(
		async (data) => {
			courses = data;
			coursesReady = true;

			if (courses.length > 0) {
				courseId = courses[0].id;
			}
		},
		async (data) => {
			await Toast.fire({
				title: data?.message ?? "Failed to get courses.",
				icon: "error"
			});
		}
	));
	$effect(() => {
		if (coursesReady) {
			untrack(() => searchRecords());
		}
	})
</script>

<RecordsList
	bind:query={query}
	bind:courseId={courseId}
	{courses}
	onAdd={() => {}}
	{onQueryClear}
	{archived}
	{recordsInfo}
	{onSearch}
	onOpen={() => {}}
	{onArchive}
	{onRestore}
	{onPrev}
	{onNext}
/>
{#if confirmArcresPopupOpen}
	<ConfirmPopup
		confirmText={`${archived ? "Restore" : "Archive"} ${confirmArcresPopupRecord.filename}?`}
		onConfirm={onConfirmArcres}
		onCancel={onCancelArcres}
	/>
{/if}