<script>
	import { onMount } from "svelte";
	import { page } from '$app/stores';
	import { Toast } from "$lib/app/utils/swal";
	import { CourseService } from "$lib/app/services/insti/course";
	import { Archive, ArchiveRestore, Pen, Search } from "lucide-svelte";
	import HeadBar from "$lib/components/grouped/users/admins/HeadBar.svelte";
	import Button from "$lib/components/single/global/Button.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import ListPageController from "$lib/components/single/users/admin/ListPageController.svelte";
	import CoursesList from "$lib/components/grouped/users/admins/dean/CoursesList.svelte";
	import CourseAddModal from "$lib/components/grouped/users/admins/dean/CourseAddModal.svelte";
	import CourseEditModal from "$lib/components/grouped/users/admins/dean/CourseEditModal.svelte";

	let archived = false;
	let addModalOpen = $state(false);
	let editModalOpen = $state(false);
	let editModalCourse = $state(null);
	let confirmArcresPopupOpen = $state(false);
	let confirmArcresPopupCourse = $state(null);
	let query = $state("");
	let coursesInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});

	async function onAdd() {
		addModalOpen = true;
	}

	async function onAddCommit(course) {
		await CourseService.create(
			course,
			async (data, status) => {
				addModalOpen = false;
				await searchCourses();
				await Toast.fire({
					title: data?.message ?? "Course has been created.",
					icon: "success"
				})
			},
			async (data, status) => {
				addModalOpen = false;
				await Toast.fire({
					title: data?.message ?? "Failed to create course.",
					icon: "error"
				})
			},
		);
	}

	function onAddModalExit() {
		addModalOpen = false;
	}

	async function searchCourses() {
		await CourseService.search(query, {
			page: coursesInfo.page,
			perPage: coursesInfo.perPage,
			archived,
			onSuccess: async (data, status) => coursesInfo = data,
			onFail: async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Failed to get courses.",
					icon: "error"
				});
			}
		});
	}

	async function onQueryClear() {
		query = "";
		coursesInfo.page = 1;
		await searchCourses();
	}

	async function onConfirmArcres() {
		if (archived) {
			await CourseService.restore(
				confirmArcresPopupCourse,
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupCourse = null;
	
					await searchCourses();
					await Toast.fire({
						title: data?.message ?? "Course has been restored.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupCourse = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to restore course.",
						icon: "error"
					})
				},
			)
		} else {
			await CourseService.archive(
				confirmArcresPopupCourse,
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupCourse = null;
	
					await searchCourses();
					await Toast.fire({
						title: data?.message ?? "Course has been archived.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmArcresPopupOpen = false;
					confirmArcresPopupCourse = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to archive course.",
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
		coursesInfo.page = 1;
		await searchCourses();
	}

	async function onEdit(course) {
		editModalOpen = true;
		editModalCourse = course;
	}

	async function onEditCommit(course) {
		await CourseService.edit(
			course,
			async (data, status) => {
				editModalOpen = false;
				await searchCourses();
				await Toast.fire({
					title: data?.message ?? "Course has been edited.",
					icon: "success"
				});
			},
			async (data, status) => {
				editModalOpen = false;
				await Toast.fire({
					title: data?.message ?? "Failed to rename course.",
					icon: "error"
				});
			},
		);
	}

	function onEditModalExit() {
		editModalOpen = false;
		editModalCourse = null;
	}

	async function onArchive(course) {
		confirmArcresPopupOpen = true;
		confirmArcresPopupCourse = course;
	}

	async function onRestore(course) {
		confirmArcresPopupOpen = true;
		confirmArcresPopupCourse = course;
	}

	async function onPrev() {
		if (coursesInfo.has_prev) {
			coursesInfo.page--;
			await searchCourses();
		}
	}

	async function onNext() {
		if (coursesInfo.has_next) {
			coursesInfo.page++;
			await searchCourses();
		}
	}

	onMount(searchCourses);
</script>

<CoursesList
	bind:query={query}
	{onAdd}
	{onQueryClear}
	{archived}
	{coursesInfo}
	{onSearch}
	{onEdit}
	{onArchive}
	{onRestore}
	{onPrev}
	{onNext}
/>
{#if addModalOpen}
	<CourseAddModal
		onExit={onAddModalExit}
		{onAddCommit}
	/>
{/if}
{#if editModalOpen}
	<CourseEditModal
		onExit={onEditModalExit}
		{onEditCommit}
		course={editModalCourse}
	/>
{/if}
{#if confirmArcresPopupOpen}
	<ConfirmPopup
		confirmText={`${archived ? "Restore" : "Archive"} ${confirmArcresPopupCourse.name}?`}
		onConfirm={onConfirmArcres}
		onCancel={onCancelArcres}
	/>
{/if}