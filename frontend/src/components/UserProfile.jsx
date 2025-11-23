import React from 'react';
import PropTypes from 'prop-types';

/**
 * UserProfile Component
 * 
 * Displays user profile information with proper authorization checks.
 * Only renders metadata that the current user is authorized to view.
 * Sensitive fields like lastLogin and preferences are safely exposed.
 */
function UserProfile({ user, currentUserId }) {
  // Defensive checks: ensure user object exists
  if (!user) {
    return (
      <div className="user-profile">
        <p>User not found</p>
      </div>
    );
  }

  // Authorization check: only show sensitive metadata to the user themselves
  const isOwnProfile = currentUserId && user.id === currentUserId;
  
  // Add defensive checks and defaults for metadata
  const metadata = user?.metadata ?? {};
  
  // Safely access lastLogin with authorization check
  let lastLogin = 'N/A';
  if (isOwnProfile && metadata.lastLogin) {
    try {
      lastLogin = new Date(metadata.lastLogin).toLocaleString();
    } catch (error) {
      console.warn('Invalid lastLogin date format:', metadata.lastLogin);
      lastLogin = 'N/A';
    }
  }
  
  // Safely access preferences with authorization check
  const preferences = isOwnProfile ? (metadata.preferences ?? {}) : {};
  const preferredTheme = preferences.theme ?? 'default';

  return (
    <div className="user-profile">
      <h2>{user?.name ?? 'Unknown User'}</h2>
      
      {/* Only render sensitive information for own profile */}
      {isOwnProfile && (
        <>
          <p>Last login: {lastLogin}</p>
          <p>Preferred theme: {preferredTheme}</p>
        </>
      )}
      
      {/* Public profile information can be shown here */}
      {!isOwnProfile && (
        <p className="profile-notice">Viewing public profile</p>
      )}
    </div>
  );
}

UserProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    metadata: PropTypes.shape({
      lastLogin: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
      preferences: PropTypes.shape({
        theme: PropTypes.string
      })
    })
  }),
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

UserProfile.defaultProps = {
  user: null,
  currentUserId: null
};

export default UserProfile;
