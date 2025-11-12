// BEFORE: accessing user.metadata directly
// const lastLogin = user.metadata.lastLogin.toLocaleString();

function UserProfile({ user }) {
  // Add defensive checks and defaults
  const metadata = user?.metadata ?? {};
  const lastLogin = metadata.lastLogin ? new Date(metadata.lastLogin).toLocaleString() : 'N/A';
  const preferences = metadata.preferences ?? {};

  return (
    <div className="user-profile">
      <h2>{user?.name ?? 'Unknown User'}</h2>
      <p>Last login: {lastLogin}</p>
      {/* render preferences safely */}
      <p>Preferred theme: {preferences.theme ?? 'default'}</p>
    </div>
  );
}
