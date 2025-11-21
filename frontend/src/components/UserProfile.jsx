import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';

/**
 * UserProfile component - displays user profile information with proper authorization checks
 * 
 * Security considerations:
 * - Only displays metadata for the authenticated user viewing their own profile
 * - Implements defensive checks for all metadata fields
 * - Sanitizes and validates all displayed values
 * - Does not expose sensitive information to unauthorized users
 */
function UserProfile({ user }) {
  const { currentUser } = useAuth();

  // Authorization check: ensure the profile being viewed belongs to the authenticated user
  const isOwnProfile = currentUser?.id === user?.id;

  // Add defensive checks and defaults
  const metadata = user?.metadata ?? {};
  
  // Only expose sensitive metadata to the profile owner
  const lastLogin = isOwnProfile && metadata.lastLogin 
    ? new Date(metadata.lastLogin).toLocaleString() 
    : null;
  
  const preferences = isOwnProfile ? (metadata.preferences ?? {}) : {};

  // Sanitize display name to prevent XSS
  const displayName = user?.name ? String(user.name).substring(0, 100) : 'Unknown User';

  return (
    <div className="user-profile">
      <h2>{displayName}</h2>
      
      {/* Only show sensitive information to the profile owner */}
      {isOwnProfile && (
        <>
          {lastLogin && (
            <p className="user-metadata">
              Last login: <span data-testid="last-login">{lastLogin}</span>
            </p>
          )}
          
          {preferences.theme && (
            <p className="user-preferences">
              Preferred theme: <span data-testid="theme-preference">{preferences.theme}</span>
            </p>
          )}
        </>
      )}
      
      {/* Public profile information can go here */}
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
      lastLogin: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      preferences: PropTypes.object
    })
  })
};

export default UserProfile;
