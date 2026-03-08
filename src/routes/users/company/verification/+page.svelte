<script>
	import { user } from "$lib/app/stores/user";
	import VerificationView from "$lib/components/grouped/users/company/VerificationView.svelte";
	import { onMount } from "svelte";

    let requirements = $state([]);

    onMount(() => {
        requirements = [
            {
                display: "Company Profile",                          
                status: $user.profile.stat_req_company_profile,
                file: $user.profile.req_company_profile,
                source: "profile",
                pureName: "req_company_profile"
            },
            {
                display: "Business Permit",                          
                status: $user.profile.stat_req_business_permit,
                file: $user.profile.req_business_permit,
                source: "permit",
                pureName: "req_business_permit"
            },
            {
                display: "SEC",                                      
                status: $user.profile.stat_req_sec,
                file: $user.profile.req_sec,
                source: "sec",
                pureName: "req_sec"
            },
            {
                display: "DTI / CDA Reg.",                           
                status: $user.profile.stat_req_dti_cda,
                file: $user.profile.req_dti_cda,
                source: "dti_cda",
                pureName: "req_dti_cda"
            },
            {
                display: "Registry of Establishment fr. DOLE",       
                status: $user.profile.stat_req_reg_of_est,
                file: $user.profile.req_reg_of_est,
                source: "reg_of_est",
                pureName: "req_reg_of_est"
            },
            {
                display: "Phil-JobNet Reg.",                         
                status: $user.profile.stat_req_philjobnet_reg,
                file: $user.profile.req_philjobnet_reg,
                source: "reg_philjobnet",
                pureName: "req_philjobnet_reg"
            },
            {
                display: "Certification from DOLE Provincial Office",
                status: $user.profile.stat_req_cert_from_dole,
                file: $user.profile.req_cert_from_dole,
                source: "cert_from_dole",
                pureName: "req_cert_from_dole"
            },
            {
                display: "Certification of No Pending Case",         
                status: $user.profile.stat_req_cert_no_case,
                file: $user.profile.req_cert_no_case,
                source: "cert_no_case",
                pureName: "req_cert_no_case"
            },
        ];
    })
</script>

<VerificationView
    {requirements}
/>