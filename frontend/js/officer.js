document.addEventListener('DOMContentLoaded', () => {
    fetchOfficerDashboard();
});

async function fetchOfficerDashboard() {
    try {
        const res = await fetch('/api/claims');
        const claims = await res.json();
        const container = document.getElementById('officer-claims');
        if (container) {
            container.innerHTML = claims.map(claim => `
                <tr>
                    <td>${claim.claimId}</td>
                    <td>${claim.Policyholder?.User?.name || 'N/A'}</td>
                    <td>${claim.treatmentType}</td>
                    <td>${claim.claimAmount}</td>
                    <td><div class="risk-score risk-${getRiskLevel(claim.fraudScore)}">${claim.fraudScore}</div></td>
                    <td><span class="status-${claim.status.toLowerCase().replace(' ', '-')}">${claim.status}</span></td>
                    <td>
                        <button onclick="updateStatus(${claim.claimId}, 'Approved')" class="btn-approve">Approve</button>
                        <button onclick="updateStatus(${claim.claimId}, 'Rejected')" class="btn-reject">Reject</button>
                        <button onclick="updateStatus(${claim.claimId}, 'More Info Requested')" class="btn-info">Info</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

function getRiskLevel(score) {
    if (score <= 30) return 'low';
    if (score <= 60) return 'medium';
    return 'high';
}

async function updateStatus(id, status) {
    const officerNotes = prompt(`Enter notes for ${status}:`);
    try {
        const res = await fetch(`/api/claims/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, officerNotes })
        });
        if (res.ok) {
            alert(`Claim ${status} successfully`);
            fetchOfficerDashboard();
        }
    } catch (err) {
        console.error(err);
    }
}
