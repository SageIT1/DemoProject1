import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * UserProfile Component
 * 
 * Renders user profile information with proper authorization checks.
 * Only displays sensitive metadata (lastLogin, preferences) when the
 * authenticated user matches the profile being viewed.
 * 
 * @param {Object} props
 * @param {Object} props.user - The user object containing profile data
 * @param {string} props.user.id - Unique user identifier
 * @param {string} props.user.name - User's display name
 * @param {Object} props.user.metadata - User metadata (sensitive)
 * @param {string} props.user.metadata.lastLogin - ISO timestamp of last login
 * @param {Object} props.user.metadata.preferences - User preferences object
 */
function UserProfile({ user }) {
  // Get the currently authenticated user from context
  const { currentUser } = useContext(AuthContext);
  
  // Defensive checks and defaults for user object
  const metadata = user?.metadata ?? {};
  const userId = user?.id ?? null;
  const userName = user?.name ?? 'Unknown User';
  
  // Authorization check: only show sensitive metadata if viewing own profile
  const isOwnProfile = currentUser?.id && userId && currentUser.id === userId;
  
  // Safe rendering of lastLogin with authorization check
  const lastLogin = isOwnProfile && metadata.lastLogin 
    ? new Date(metadata.lastLogin).toLocaleString() 
    : null;
  
  // Safe rendering of preferences with authorization check
  const preferences = isOwnProfile ? (metadata.preferences ?? {}) : {};
  const preferredTheme = preferences.theme ?? 'default';

  return (
    <div className="user-profile">
      <h2>{userName}</h2>
      
      {/* Only render sensitive metadata for authorized user */}
      {isOwnProfile && (
        <>
          {lastLogin && (
            <p className="user-metadata">
              Last login: <span className="metadata-value">{lastLogin}</span>
            </p>
          )}
          {preferences && (
            <p className="user-metadata">
              Preferred theme: <span className="metadata-value">{preferredTheme}</span>
            </p>
          )}
        </>
      )}
      
      {/* Show message when viewing another user's profile */}
      {!isOwnProfile && (
        <p className="info-message">
          Viewing public profile information only.
        </p>
      )}
    </div>
  );
}

export default UserProfile;
