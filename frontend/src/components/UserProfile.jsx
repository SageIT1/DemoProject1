import React from 'react';
import PropTypes from 'prop-types';

/**
 * UserProfile component - displays user information with proper authorization checks
 * 
 * Security considerations:
 * - Assumes server-side authorization has validated user access
 * - Defensively handles missing/undefined metadata
 * - Only renders data that has been explicitly provided by authorized API
 */
function UserProfile({ user, currentUserId }) {
  // Defensive checks for user object and metadata
  if (!user) {
    return (
      <div className="user-profile">
        <p>User information unavailable</p>
      </div>
    );
  }

  // Verify authorization - only show sensitive metadata if viewing own profile
  const isOwnProfile = currentUserId && user.id === currentUserId;
  const metadata = user?.metadata ?? {};
  
  // Safely access and format lastLogin with proper checks
  const lastLogin = metadata.lastLogin 
    ? new Date(metadata.lastLogin).toLocaleString() 
    : 'N/A';
  
  // Safely access preferences with defaults
  const preferences = metadata.preferences ?? {};
  const theme = preferences.theme ?? 'default';
  const language = preferences.language ?? 'en';

  return (
    <div className="user-profile">
      <h2>{user?.name ?? 'Unknown User'}</h2>
      <p>Email: {user?.email ?? 'N/A'}</p>
      
      {/* Only display sensitive metadata for authorized user */}
      {isOwnProfile && (
        <>
          <div className="user-metadata">
            <p>Last login: {lastLogin}</p>
          </div>
          
          <div className="user-preferences">
            <h3>Your Preferences</h3>
            <p>Preferred theme: {theme}</p>
            <p>Language: {language}</p>
          </div>
        </>
      )}
      
      {!isOwnProfile && (
        <p className="info-message">
          Additional profile details are private
        </p>
      )}
    </div>
  );
}

UserProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    metadata: PropTypes.shape({
      lastLogin: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      preferences: PropTypes.shape({
        theme: PropTypes.string,
        language: PropTypes.string
      })
    })
  }),
  currentUserId: PropTypes.string
};

UserProfile.defaultProps = {
  user: null,
  currentUserId: null
};

export default UserProfile;
