document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.querySelector('.claim-box form');
    if (claimForm) {
        claimForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('patientCnic', claimForm.querySelector('input[placeholder="XXXXX-XXXXXXX-X"]').value);
            formData.append('policyNumber', claimForm.querySelector('input[placeholder="Enter Policy Number"]').value);
            formData.append('treatmentType', claimForm.querySelector('input[placeholder="Enter Treatment Details"]').value);
            formData.append('claimAmount', claimForm.querySelector('input[placeholder="Enter Amount"]').value);
            formData.append('notes', claimForm.querySelector('textarea').value);

            const fileInputs = claimForm.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
                if (input.files[0]) {
                    formData.append('documents', input.files[0]);
                }
            });

            try {
                const res = await fetch('/api/claims', {
                    method: 'POST',
                    body: formData
                });
                if (res.ok) {
                    alert('Claim submitted successfully!');
                    window.location.href = 'hospital-dashboard.html';
                } else {
                    const data = await res.json();
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred while submitting claim');
            }
        });
    }

    const claimList = document.getElementById('hospital-claims');
    if (claimList) {
        fetchClaims();
    }
});

async function fetchClaims() {
    try {
        const res = await fetch('/api/claims');
        const claims = await res.json();
        const container = document.getElementById('hospital-claims');
        if (!container) return;
        
        container.innerHTML = claims.map(claim => `
            <tr>
                <td>${claim.claimId}</td>
                <td>${claim.Policyholder?.User?.name || 'N/A'}</td>
                <td>${claim.treatmentType}</td>
                <td>${claim.claimAmount}</td>
                <td><span class="status-${claim.status.toLowerCase().replace(' ', '-')}">${claim.status}</span></td>
                <td>${new Date(claim.submissionDate).toLocaleDateString()}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}
