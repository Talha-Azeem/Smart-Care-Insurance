document.addEventListener('DOMContentLoaded', () => {
    fetchNotifications();
});

async function fetchNotifications() {
    try {
        const res = await fetch('/api/notifications');
        const notifications = await res.json();
        const container = document.getElementById('notificationsList');
        if (container) {
            container.innerHTML = notifications.length > 0 ? notifications.map(n => `
                <div class="notification-card ${n.isRead ? '' : 'unread'}" data-type="all">
                    <div class="notif-icon ${getNotifClass(n.message)}">
                        <i class="fa-solid ${getNotifIcon(n.message)}"></i>
                    </div>
                    <div class="notif-content">
                        <h4>Notification</h4>
                        <p>${n.message}</p>
                        <span class="time"><i class="fa-regular fa-clock"></i> ${new Date(n.date).toLocaleString()}</span>
                    </div>
                </div>
            `).join('') : '<div class="empty-state"><p>No notifications found</p></div>';
        }
    } catch (err) {
        console.error(err);
    }
}

function getNotifClass(message) {
    if (message.includes('Approved')) return 'approved';
    if (message.includes('Rejected')) return 'rejected';
    return 'pending';
}

function getNotifIcon(message) {
    if (message.includes('Approved')) return 'fa-circle-check';
    if (message.includes('Rejected')) return 'fa-circle-xmark';
    return 'fa-clock';
}

async function markAllRead() {
    try {
        await fetch('/api/notifications/read', { method: 'PUT' });
        fetchNotifications();
    } catch (err) {
        console.error(err);
    }
}
