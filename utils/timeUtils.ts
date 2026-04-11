function formatActivityTime(createdAt: string | number | Date) {
    if (!createdAt) {
        return "Just now";
    }

    // Backend UTC dates
    const createdUTC = new Date(createdAt);
    const nowUTC = new Date();

    // IST offset
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    // Convert UTC → IST
    const createdIST = new Date(createdUTC.getTime() + IST_OFFSET_MS);
    const nowIST = new Date(nowUTC.getTime());

    // Differences
    const diffMs = nowIST.getTime() - createdIST.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Output decision
    let result;
    if (diffMinutes < 2) result = "Just now";
    else if (diffMinutes < 60) result = `${diffMinutes} mins ago`;
    else if (diffHours < 24) result = `${diffHours} hours ago`;
    else
        result = `${diffDays} ${diffDays === 1 ? 'day ago' : 'days ago'}`;

    return result;
}

export default formatActivityTime;
