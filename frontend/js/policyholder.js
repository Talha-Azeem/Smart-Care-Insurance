document.addEventListener('DOMContentLoaded', () => {
    fetchPolicyholderData();
});

async function fetchPolicyholderData() {
    try {
        const res = await fetch('/api/claims');
        const claims = await res.json();
        const container = document.getElementById('policyholder-claims');
        if (container) {
            container.innerHTML = claims.map(claim => `
                <tr>
                    <td>${claim.claimId}</td>
                    <td>${claim.Hospital?.hospitalName || 'N/A'}</td>
                    <td>${claim.treatmentType}</td>
                    <td>${claim.claimAmount}</td>
                    <td><span class="status-${claim.status.toLowerCase().replace(' ', '-')}">${claim.status}</span></td>
                    <td>${new Date(claim.submissionDate).toLocaleDateString()}</td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error(err);
    }
}
