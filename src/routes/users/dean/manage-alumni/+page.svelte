<script>
	import { Toast } from "$lib/app/utils/swal";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import { onMount, untrack } from "svelte";
	import AlumniList from "$lib/components/grouped/users/admins/dean/AlumniList.svelte";
	import { CourseService } from "$lib/app/services/insti/course";
	import { AlumniService } from "$lib/app/services/users/alumni";
	import AlumniProfileView from "$lib/components/grouped/users/admins/dean/AlumniProfileView.svelte";
	import AlumniRejectModal from "$lib/components/grouped/global/AlumniRejectModal.svelte";
	import AlumniRejectionsView from "$lib/components/grouped/users/admins/dean/AlumniRejectionsView.svelte";

    let query = $state("");
    let enabled = $state(true);
	let verStatus = $state("Pending");
	let viewProfileOpen = $state(false);
	let viewProfileAlumni = $state(null);
	let confirmVerifyPopupOpen = $state(false);
	let confirmVerifyPopupAlumni = $state(null);
	let confirmRejectPopupOpen = $state(false);
	let confirmRejectPopupAlumni = $state(null);
	let confirmEndisPopupOpen = $state(false);
	let confirmEndisPopupAlumni = $state(null);
    let alumniInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});
	let viewRejectionsOpen = $state(false);
	let rejections = $state(null);
	let courseId = $state(0);
	let coursesReady = $state(false);
	let courses = $state([]);

	async function searchAlumni() {
        await AlumniService.search(query, {
			page: alumniInfo.page,
			perPage: alumniInfo.perPage,
			enabled,
			verStatus,
            courseId,
			onSuccess: async (data, status) => {
                alumniInfo = data;
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
		alumniInfo.page = 1;
		await searchAlumni();
	}

	async function onEnable(pstaff) {
		confirmEndisPopupOpen = true;
		confirmEndisPopupAlumni = pstaff;
	}

	async function onDisable(pstaff) {
		confirmEndisPopupOpen = true;
		confirmEndisPopupAlumni = pstaff;
	}

	async function onQueryClear() {
		query = "";
		alumniInfo.page = 1;
		await searchAlumni();
	}

	async function onConfirmEndis() {
		if (enabled) {
			await AlumniService.disable(
				confirmEndisPopupAlumni,
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupAlumni = null;
	
					await searchAlumni();
					await Toast.fire({
						title: data?.message ?? "Alumni has been disabled.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupAlumni = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to disable alumni.",
						icon: "error"
					})
				},
			)
		} else {
			await AlumniService.enable(
				confirmEndisPopupAlumni,
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupAlumni = null;
	
					await searchAlumni();
					await Toast.fire({
						title: data?.message ?? "Alumni has been disabled.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupAlumni = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to enable alumni.",
						icon: "error"
					})
				},
			)
		}
	}

	async function onCancelEndis() {
		confirmEndisPopupOpen = false;
	}

	async function onPrev() {
		if (alumniInfo.has_prev) {
			alumniInfo.page--;
			await searchAlumni();
		}
	}

	async function onNext() {
		if (alumniInfo.has_next) {
			alumniInfo.page++;
			await searchAlumni();
		}
	}

	function onProfileView(alumni) {
		viewProfileOpen = true;
		viewProfileAlumni = alumni;
	}

	function onProfileViewExit(alumni) {
		viewProfileOpen = false;
		viewProfileAlumni = null;
	}

	async function onVerify(alumni) {
		confirmVerifyPopupAlumni = alumni;
		confirmVerifyPopupOpen = true;
	}

	async function onConfirmVerify() {
		await AlumniService.verify(
			confirmVerifyPopupAlumni,
			async (data, status) => {
				confirmVerifyPopupAlumni = null;
				confirmVerifyPopupOpen = false;

				await searchAlumni();
				await Toast.fire({
					title: data?.message ?? "Alumni has been verified.",
					icon: "success",
					timer: 4000
				});
			},
			async (data, status) => {
				confirmVerifyPopupAlumni = null;
				confirmVerifyPopupOpen = false;

				await Toast.fire({
					title: data?.message ?? "Unable to set the alumni as verified.",
					icon: "error"
				});
			},
		);
	}

	async function onCancelVerify() {
		confirmVerifyPopupAlumni = null;
		confirmVerifyPopupOpen = false;
	}

	async function onReject(alumni) {
		confirmRejectPopupAlumni = alumni;
		confirmRejectPopupOpen = true;
	}

	async function onConfirmReject(message) {
		await AlumniService.reject(
			confirmRejectPopupAlumni,
			message,
			async (data, status) => {
				confirmRejectPopupAlumni = null;
				confirmRejectPopupOpen = false;

				await searchAlumni();
				await Toast.fire({
					title: data?.message ?? "Alumni has been rejected.",
					icon: "success",
					timer: 4000
				});
			},
			async (data, status) => {
				confirmRejectPopupAlumni = null;
				confirmRejectPopupOpen = false;

				await Toast.fire({
					title: data?.message ?? "Unable to set the alumni as rejected.",
					icon: "error"
				});
			},
		);
	}

	async function onCancelReject() {
		confirmRejectPopupAlumni = null;
		confirmRejectPopupOpen = false;
	}

	async function onViewRejections(alumni) {
		await AlumniService.getRejectionAppeals(alumni,
			async (data, stat) => {
				rejections = { list: data, alumni };
				viewRejectionsOpen = true;
			},
			async (data, stat) => {
				await Toast.fire({
					title: data?.message ?? "Failed to get appeals.",
					icon: "error"
				});
			},
		);
	}

	async function onExitRejections() {
		rejections = [];
		viewRejectionsOpen = false;
	}

	async function onAfterAlumniPend() {
		verStatus = "Pending";
		viewRejectionsOpen = false;

		await searchAlumni();
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
			untrack(() => searchAlumni());
		}
	})
</script>

{#if viewProfileOpen}
	<AlumniProfileView
		alumni={viewProfileAlumni}
		onViewExit={onProfileViewExit}
	/>
{:else if viewRejectionsOpen}
	<AlumniRejectionsView
		{rejections}
		{onExitRejections}
		{onAfterAlumniPend}
	/>
{:else}
	{#if coursesReady}
		<AlumniList
			bind:query={query}
			bind:enabled={enabled}
			bind:verStatus={verStatus}
			bind:courseId={courseId}
			{alumniInfo}
			{courses}
			{onSearch}
			{onDisable}
			{onEnable}
			{onPrev}
			{onNext}
			{onQueryClear}
			{onProfileView}
			{onVerify}
			{onReject}
			{onViewRejections}
		/>
	{/if}
	{#if confirmEndisPopupOpen}
		<ConfirmPopup
			confirmText={`${enabled ? "Disable" : "Enable"} ${confirmEndisPopupAlumni.email}?`}
			onConfirm={onConfirmEndis}
			onCancel={onCancelEndis}
		/>
	{/if}
{/if}
{#if confirmVerifyPopupOpen}
	<ConfirmPopup
		confirmText={`Verify ${confirmVerifyPopupAlumni.profile.first_name}${confirmVerifyPopupAlumni.profile.name_extension && (" " + confirmVerifyPopupAlumni.profile.name_extension)} ${confirmVerifyPopupAlumni.profile.middle_name && (confirmVerifyPopupAlumni.profile.middle_name + " ")}${confirmVerifyPopupAlumni.profile.last_name}?`}
		onConfirm={onConfirmVerify}
		onCancel={onCancelVerify}
	/>
{/if}
{#if confirmRejectPopupOpen}
	<AlumniRejectModal
		alumni={confirmRejectPopupAlumni}
		{onCancelReject}
		{onConfirmReject}
	/>
{/if}