<script>
	import { CompanyService } from "$lib/app/services/users/company";
	import { Toast } from "$lib/app/utils/swal";
	import CompanyRejectionsView from "$lib/components/grouped/global/CompanyRejectionsView.svelte";
	import CompanyRejectModal from "$lib/components/grouped/global/CompanyRejectModal.svelte";
	import CompanyList from "$lib/components/grouped/users/admins/sysad/CompanyList.svelte";
	import CompanyProfileView from "$lib/components/grouped/users/admins/sysad/CompanyProfileView.svelte";
	import SysadAddModal from "$lib/components/grouped/users/admins/sysad/SysadAddModal.svelte";
	import SysadsList from "$lib/components/grouped/users/admins/sysad/SysadsList.svelte";
	import ConfirmPopup from "$lib/components/single/global/ConfirmPopup.svelte";
	import { onMount } from "svelte";

    let query = $state("");
    let enabled = $state(true);
	let verStatus = $state("Pending");
	let industry = $state("Technology / IT");
	let viewProfileOpen = $state(false);
	let viewProfileCompany = $state(null);
	let confirmEndisPopupOpen = $state(false);
	let confirmEndisPopupCompany = $state(null);
	
	let confirmVerifyPopupOpen = $state(false);
	let confirmVerifyPopupCompany = $state(null);
	let confirmRejectPopupOpen = $state(false);
	let confirmRejectPopupCompany = $state(null);

    let companiesInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});
	let viewRejectionsOpen = $state(false);
	let rejections = $state(null);

    async function searchCompanies() {
        await CompanyService.search(query, {
            page: companiesInfo.page,
			perPage: companiesInfo.perPage,
			enabled,
			ver_status: verStatus,
			industry,
			onSuccess: async (data, status) => {
                companiesInfo = data;
            },
			onFail: async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Failed to get companies.",
					icon: "error"
				});
			}
        });
    }

	async function onQueryClear() {
		query = "";
		companiesInfo.page = 1;
		await searchCompanies();
	}

	async function onConfirmEndis() {
		if (enabled) {
			await CompanyService.disable(
				confirmEndisPopupCompany,
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupCompany = null;
	
					await searchCompanies();
					await Toast.fire({
						title: data?.message ?? "Company has been disabled.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupCompany = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to disable company.",
						icon: "error"
					})
				},
			)
		} else {
			await CompanyService.enable(
				confirmEndisPopupCompany,
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupCompany = null;
	
					await searchCompanies();
					await Toast.fire({
						title: data?.message ?? "Company has been disabled.",
						icon: "success"
					})
				},
				async (data, status) => {
					confirmEndisPopupOpen = false;
					confirmEndisPopupCompany = null;
	
					await Toast.fire({
						title: data?.message ?? "Failed to enable company.",
						icon: "error"
					})
				},
			)
		}
	}

	async function onCancelEndis() {
		confirmEndisPopupOpen = false;
	}

	async function onSearch() {
		companiesInfo.page = 1;
		await searchCompanies();
	}

	async function onEnable(sysad) {
		confirmEndisPopupOpen = true;
		confirmEndisPopupCompany = sysad;
	}

	async function onDisable(sysad) {
		confirmEndisPopupOpen = true;
		confirmEndisPopupCompany = sysad;
	}

	async function onPrev() {
		if (companiesInfo.has_prev) {
			companiesInfo.page--;
			await searchCompanies();
		}
	}

	async function onNext() {
		if (companiesInfo.has_next) {
			companiesInfo.page++;
			await searchCompanies();
		}
	}

	function onProfileView(company) {
		viewProfileOpen = true;
		viewProfileCompany = company;
	}

	function onProfileViewExit(company) {
		viewProfileOpen = false;
		viewProfileCompany = null;
	}

	async function onVerify(company) {
		confirmVerifyPopupCompany = company;
		confirmVerifyPopupOpen = true;
	}
	
	async function onConfirmVerify() {
		await CompanyService.verify(
			confirmVerifyPopupCompany,
			async (data, status) => {
				confirmVerifyPopupCompany = null;
				confirmVerifyPopupOpen = false;

				await searchCompanies();
				await Toast.fire({
					title: data?.message ?? "Company has been verified.",
					icon: "success",
					timer: 4000
				});
			},
			async (data, status) => {
				confirmVerifyPopupCompany = null;
				confirmVerifyPopupOpen = false;

				await Toast.fire({
					title: data?.message ?? "Unable to set the company as verified.",
					icon: "error"
				});
			},
		);
	}
	
	async function onCancelVerify() {
		confirmVerifyPopupCompany = null;
		confirmVerifyPopupOpen = false;
	}

	async function onReject(company) {
		confirmRejectPopupCompany = company;
		confirmRejectPopupOpen = true;
	}
	
	async function onConfirmReject(message) {
		await CompanyService.reject(
			confirmRejectPopupCompany,
			message,
			async (data, status) => {
				confirmRejectPopupCompany = null;
				confirmRejectPopupOpen = false;

				await searchCompanies();
				await Toast.fire({
					title: data?.message ?? "Company has been rejected.",
					icon: "success",
					timer: 4000
				});
			},
			async (data, status) => {
				confirmRejectPopupCompany = null;
				confirmRejectPopupOpen = false;

				await Toast.fire({
					title: data?.message ?? "Unable to set the company as rejected.",
					icon: "error"
				});
			},
		);
	}
	
	async function onCancelReject() {
		confirmRejectPopupCompany = null;
		confirmRejectPopupOpen = false;
	}

	async function onViewRejections(company) {
		await CompanyService.getRejectionAppeals(company,
			async (data, stat) => {
				rejections = { list: data, company };
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

	async function onAfterCompanyPend() {
		verStatus = "Pending";
		viewRejectionsOpen = false;

		await searchCompanies();
	}

    onMount(searchCompanies);
</script>

{#if viewProfileOpen}
	<CompanyProfileView
		company={viewProfileCompany}
		onViewExit={onProfileViewExit}
	/>
{:else if viewRejectionsOpen}
	<CompanyRejectionsView
		{rejections}
		{onExitRejections}
		{onAfterCompanyPend}
	/>
{:else}
	<CompanyList
		bind:query={query}
		bind:enabled={enabled}
		bind:verStatus={verStatus}
		bind:industry={industry}
		{companiesInfo}
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
		confirmText={`${enabled ? "Disable" : "Enable"} ${confirmEndisPopupCompany.email}?`}
		onConfirm={onConfirmEndis}
		onCancel={onCancelEndis}
	/>
{/if}
{#if confirmVerifyPopupOpen}
	<ConfirmPopup
		confirmText={`Verify ${confirmVerifyPopupCompany.profile.name}?`}
		onConfirm={onConfirmVerify}
		onCancel={onCancelVerify}
	/>
{/if}
{#if confirmRejectPopupOpen}
	<CompanyRejectModal
		company={confirmRejectPopupCompany}
		{onCancelReject}
		{onConfirmReject}
	/>
{/if}