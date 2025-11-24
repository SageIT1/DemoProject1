import React from 'react';
import PropTypes from 'prop-types';

/**
 * UserProfile component - displays user information with proper authorization checks
 * Ensures sensitive metadata is only shown to the authorized user
 */
function UserProfile({ user, currentUserId }) {
  // Defensive checks for user object
  if (!user) {
    return (
      <div className="user-profile">
        <p>User information unavailable</p>
      </div>
    );
  }

  // Check if current user is authorized to view sensitive data
  const isAuthorizedUser = currentUserId && user.id === currentUserId;
  
  // Safe extraction of metadata with defaults
  const metadata = user.metadata ?? {};
  
  // Only expose sensitive fields to authorized user
  const lastLogin = isAuthorizedUser && metadata.lastLogin 
    ? new Date(metadata.lastLogin).toLocaleString() 
    : null;
  
  const preferences = isAuthorizedUser ? (metadata.preferences ?? {}) : {};
  
  // Sanitize and validate preference values
  const allowedThemes = ['light', 'dark', 'default'];
  const preferredTheme = allowedThemes.includes(preferences.theme) 
    ? preferences.theme 
    : 'default';

  return (
    <div className="user-profile">
      <h2>{user.name ?? 'Unknown User'}</h2>
      
      {/* Only show sensitive information to authorized user */}
      {isAuthorizedUser && (
        <>
          {lastLogin && (
            <p className="last-login">
              Last login: <span>{lastLogin}</span>
            </p>
          )}
          
          <div className="user-preferences">
            <p>
              Preferred theme: <span>{preferredTheme}</span>
            </p>
          </div>
        </>
      )}
      
      {/* Public information can be shown to all users */}
      <div className="public-info">
        <p>Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
      </div>
    </div>
  );
}

UserProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    createdAt: PropTypes.string,
    metadata: PropTypes.shape({
      lastLogin: PropTypes.string,
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
