import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * UserProfile Component
 * 
 * Displays user profile information with proper authorization checks.
 * Only shows sensitive metadata (lastLogin, preferences) if the current
 * authenticated user matches the profile being viewed.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User object containing profile data
 * @param {string} props.user.id - Unique user identifier
 * @param {string} props.user.name - User's display name
 * @param {Object} props.user.metadata - User metadata (requires authorization)
 */
function UserProfile({ user }) {
  // Get the current authenticated user from context
  const { currentUser } = useContext(AuthContext);
  
  // Add defensive checks and defaults
  const metadata = user?.metadata ?? {};
  
  // Authorization check: only show sensitive metadata to the user themselves
  const isOwnProfile = currentUser && user && currentUser.id === user.id;
  
  // Safely extract and format lastLogin with authorization check
  const lastLogin = isOwnProfile && metadata.lastLogin 
    ? new Date(metadata.lastLogin).toLocaleString() 
    : null;
  
  // Safely extract preferences with authorization check
  const preferences = isOwnProfile ? (metadata.preferences ?? {}) : {};
  const preferredTheme = isOwnProfile ? (preferences.theme ?? 'default') : 'default';

  return (
    <div className="user-profile">
      <h2>{user?.name ?? 'Unknown User'}</h2>
      
      {/* Only render sensitive information if viewing own profile */}
      {isOwnProfile && lastLogin && (
        <p className="user-metadata">
          Last login: <span className="metadata-value">{lastLogin}</span>
        </p>
      )}
      
      {/* Only render preferences if viewing own profile */}
      {isOwnProfile && (
        <div className="user-preferences">
          <p>
            Preferred theme: <span className="metadata-value">{preferredTheme}</span>
          </p>
        </div>
      )}
      
      {/* Show message if viewing another user's profile */}
      {!isOwnProfile && (
        <p className="privacy-notice">
          <em>Profile details are private and only visible to the profile owner.</em>
        </p>
      )}
    </div>
  );
}

export default UserProfile;
