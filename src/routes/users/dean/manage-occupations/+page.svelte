<script>
	import { CourseService } from "$lib/app/services/insti/course";
	import { Toast } from "$lib/app/utils/swal";
	import OccupationsList from "$lib/components/grouped/users/admins/dean/OccupationsList.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import { onMount, untrack } from "svelte";

	let confirmAlUnalPopupOpen = $state(false);
	let confirmAlUnalPopupOccupation = $state(null);
	let query = $state("");
    let occupationsInfo = $state({
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
	let aligned = $state(true);
    
    async function searchOccupations() {
        await CourseService.searchOccupations(query, {
			page: occupationsInfo.page,
			perPage: occupationsInfo.perPage,
            courseId,
			aligned,
			onSuccess: async (data, status) => {
                occupationsInfo = data;
            },
			onFail: async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Failed to get occupations.",
					icon: "error"
				});
			}
		})
    }

	async function onSearch() {
		occupationsInfo.page = 1;
		await searchOccupations();
	}

	async function onQueryClear() {
		query = "";
		occupationsInfo.page = 1;
		await searchOccupations();
	}

	async function onConfirmAlUnal() {
		if (aligned) {
			await CourseService.unalignOccupation(
				courseId,
				confirmAlUnalPopupOccupation.id,
				async (data, status) => {
					confirmAlUnalPopupOpen = false;
					
					await searchOccupations();
					await Toast.fire({
						title: data?.message ?? "Occupation has been unaligned.",
						icon: "success"
					});
				},
				async (data, status) => {
					confirmAlUnalPopupOpen = false;
					
					await Toast.fire({
						title: data?.message ?? "Failed to unalign occupation.",
						icon: "error"
					});
				},
			)
		} else {
			await CourseService.alignOccupation(
				courseId,
				confirmAlUnalPopupOccupation.id,
				async (data, status) => {
					confirmAlUnalPopupOpen = false;

					await searchOccupations();
					await Toast.fire({
						title: data?.message ?? "Occupation has been aligned.",
						icon: "success"
					});
				},
				async (data, status) => {
					confirmAlUnalPopupOpen = false;

					await Toast.fire({
						title: data?.message ?? "Failed to align occupation.",
						icon: "error"
					})
				},
			)
		}
	}

	async function onCancelAlUnal() {
		confirmAlUnalPopupOccupation = null;
		confirmAlUnalPopupOpen = false;
	}

	async function onAlign(occupation) {
		confirmAlUnalPopupOpen = true;
		confirmAlUnalPopupOccupation = occupation;
	}

	async function onUnalign(occupation) {
		confirmAlUnalPopupOpen = true;
		confirmAlUnalPopupOccupation = occupation;
	}
    
	async function onPrev() {
		if (occupationsInfo.has_prev) {
			occupationsInfo.page--;
			await searchOccupations();
		}
	}

	async function onNext() {
		if (occupationsInfo.has_next) {
			occupationsInfo.page++;
			await searchOccupations();
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
			untrack(() => searchOccupations());
		}
	})
</script>

{#if coursesReady}
	<OccupationsList
		bind:query={query}
		bind:courseId={courseId}
		{courses}
		{onQueryClear}
		bind:aligned={aligned}
		{occupationsInfo}
		{onSearch}
		{onAlign}
		{onUnalign}
		{onPrev}
		{onNext}
	/>
{/if}
{#if confirmAlUnalPopupOpen}
	<ConfirmPopup
		confirmText={`${aligned ? "Unalign" : "Align"} ${confirmAlUnalPopupOccupation.occupation}?`}
		onConfirm={onConfirmAlUnal}
		onCancel={onCancelAlUnal}
	/>
{/if}