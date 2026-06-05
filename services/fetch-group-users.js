export async function fetchGroupUsers(client, teamId, groupId) {
    let users = [];

    try {
        // Make request for all groups
        const groupData = await client.usergroups.list({
            team_id: teamId,
            include_users: true
        });

        // Filter groups
        const group = groupData.usergroups.find(group => group.id === groupId);

        // Check group for users
        if (group.users) {
            users = group.users;
        }

    } catch (error) {
        console.error(error);
    }

    return users;
}