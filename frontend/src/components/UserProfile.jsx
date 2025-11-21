function UserProfile({ user, currentUserId }) {
  // Ensure user can only view their own sensitive metadata
  const isOwnProfile = user?.id === currentUserId;
  
  // Add defensive checks and defaults
  const metadata = user?.metadata ?? {};
  
  // Only show sensitive information to the profile owner
  const lastLogin = isOwnProfile && metadata.lastLogin 
    ? new Date(metadata.lastLogin).toLocaleString() 
    : 'Private';
    
  const preferences = isOwnProfile ? (metadata.preferences ?? {}) : {};
  
  // Sanitize and validate user input
  const sanitizedName = user?.name ? String(user.name).substring(0, 100) : 'Unknown User';
  
  return (
    <div className="user-profile">
      <h2>{sanitizedName}</h2>
      {isOwnProfile ? (
        <>
          <p>Last login: {lastLogin}</p>
          <p>Preferred theme: {preferences.theme ?? 'default'}</p>
        </>
      ) : (
        <p>Profile information is private</p>
      )}
    </div>
  );
}