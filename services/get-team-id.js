export async function getTeamId(client) {
    const auth = await client.auth.test();

    // Single-workspace install — team_id is the workspace (T...)
    if (auth.team_id?.startsWith('T')) {
        return auth.team_id;
    }

    // Org-wide install — auth.test returns the enterprise (E...), not a workspace.
    // Use auth.teams.list to get workspace IDs the app is approved for.
    const { teams } = await client.auth.teams.list();
    if (teams?.length === 1) {
        return teams[0].id;
    }

    throw new Error(
        `Org install spans ${teams?.length ?? 0} workspaces — pass a workspace team ID (T...) explicitly`,
    );
}