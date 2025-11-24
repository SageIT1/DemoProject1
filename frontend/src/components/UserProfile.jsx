import React from 'react';
import PropTypes from 'prop-types';

/**
 * UserProfile component - displays user information with authorization checks
 * Ensures sensitive metadata is safely exposed only to authorized users
 */
function UserProfile({ user, currentUserId }) {
  // Defensive checks for user object
  if (!user) {
    return (
      <div className="user-profile">
        <p>User not found</p>
      </div>
    );
  }

  // Authorization check: ensure current user can only see their own sensitive data
  const isOwnProfile = currentUserId && user.id === currentUserId;
  
  // Safe metadata extraction with defaults
  const metadata = user?.metadata ?? {};
  const publicName = user?.name ?? 'Unknown User';
  const publicEmail = user?.email ?? '';

  // Sensitive fields - only show to authorized user
  let lastLogin = 'N/A';
  let preferences = {};

  if (isOwnProfile) {
    // Only expose sensitive metadata to the owner
    lastLogin = metadata.lastLogin 
      ? new Date(metadata.lastLogin).toLocaleString() 
      : 'N/A';
    preferences = metadata.preferences ?? {};
  }

  // Sanitize and validate preference values before rendering
  const safeTheme = preferences.theme && typeof preferences.theme === 'string'
    ? preferences.theme.substring(0, 50) // Limit length
    : 'default';

  return (
    <div className="user-profile">
      <h2>{publicName}</h2>
      {publicEmail && <p className="user-email">{publicEmail}</p>}
      
      {/* Only render sensitive info for authorized user */}
      {isOwnProfile && (
        <div className="user-private-info">
          <p className="last-login">
            <strong>Last login:</strong> {lastLogin}
          </p>
          <div className="user-preferences">
            <p>
              <strong>Preferred theme:</strong> {safeTheme}
            </p>
          </div>
        </div>
      )}
      
      {!isOwnProfile && (
        <p className="info-notice">
          Additional profile details are private
        </p>
      )}
    </div>
  );
}

UserProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    metadata: PropTypes.shape({
      lastLogin: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      preferences: PropTypes.object
    })
  }),
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

UserProfile.defaultProps = {
  user: null,
  currentUserId: null
};

export default UserProfile;
