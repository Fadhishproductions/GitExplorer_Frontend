import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { cacheRepos, cacheUser, removeUser, setFriends } from '../redux/userSlice';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getRepoIcon} from '../utils/getRepoIcon';
import UserSearch from '../components/UserSearch';


interface Repo {
  id: number;
  name: string;
  description: string;
}

const RepoListPage = () => {
  const { username = '' } = useParams<{ username: string }>();
  const dispatch = useDispatch();
  const cachedUser = useSelector((state: RootState) => state.user.users[username.toLowerCase()]);
  const cachedRepos = useSelector((state: RootState) => state.user.repos[username.toLowerCase()]);
  const cachedFriends = useSelector(
    (state: RootState) => state.user.friends[username.toLowerCase()]
  );
    const [user, setUser] = useState<any>(cachedUser || null);
  const [repos, setRepos] = useState<Repo[]>(cachedRepos || []);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
const [formData, setFormData] = useState({
  bio: user?.bio || '',
  location: user?.location || '',
  blog: user?.blog || '',
});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRepos = async () => {
      setLoading(true);
      try {
        // Always sync local state with cache or fresh fetch
        if (cachedUser) {
          setUser(cachedUser);
          setFormData({
            bio: cachedUser.bio || '',
            location: cachedUser.location || '',
            blog: cachedUser.blog || '',
          });
        } else {
          const backendRes = await axios.post(`http://localhost:5000/api/users/${username}`);
          const userData = backendRes.data.user;
          setUser(userData);
          setFormData({
            bio: userData.bio || '',
            location: userData.location || '',
            blog: userData.blog || '',
          });
          dispatch(cacheUser({ username, data: userData }));
        }
  
        if (cachedRepos) {
          setRepos(cachedRepos);
        } else {
          const githubUserRes = await axios.get(`https://api.github.com/users/${username}`);
          const reposRes = await axios.get(githubUserRes.data.repos_url);
          setRepos(reposRes.data);
          dispatch(cacheRepos({ username, data: reposRes.data }));
        }
  
        if (!cachedFriends) {
          const friendsRes = await axios.put(`http://localhost:5000/api/users/${username}/friends`);
          dispatch(setFriends({ username, data: friendsRes.data.friends }));
        }
      } catch (error) {
        console.error('Error fetching user or repos:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserAndRepos();
  }, [username, dispatch]);
  

  const handleDeleteUser = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
  
    if (!confirmed) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/users/${username}/delete`);
      dispatch(removeUser({ username }));
      alert('User soft deleted successfully ✅');
      navigate('/'); // Go back to Home
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user ❌');
    }
  };
  

  if (loading){
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '20px',
        fontWeight: 'bold'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <UserSearch/>

{user && (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '2rem',
    paddingLeft:"15px",
    paddingBottom:"15px",
    borderBottom:"1px solid #D3D3D3 "
  }}>
    <img src={user.avatar_url} alt="avatar" width={100} style={{ borderRadius: '50%' }} />
    <div >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <h2>{user.name || user.login}</h2>
      <p>{user.bio}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <p><strong>Followers:</strong> {user.followers}</p>
      <p><strong>Following:</strong> {user.following}</p>
     </div>

{/* mutual friends */}
{cachedFriends && cachedFriends?.length > 0 && (
  <div  >
    <h4 style={{ marginBottom: '0.5rem' }}>Mutual Friends</h4>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      {cachedFriends.map((friend: string) => (
        <div key={friend}>
          <button
            onClick={() => navigate(`/user/${friend}`)}
            style={{
              padding: '6px 12px',
              border: '1px solid #ccc',
              background: '#f0f0f0',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#dfefff'}
            onMouseLeave={e => e.currentTarget.style.background = '#f0f0f0'}
          >
            @{friend}
          </button>
        </div>
      ))}
    </div>
  </div>
)}

      <button
        onClick={() => navigate(`/user/${username}/followers`)}
        style={{
          marginTop: '10px',
          padding: '8px 12px',
          backgroundColor: '#0366d6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        View Followers
      </button>
      <button
  onClick={() => setEditing(!editing)}
  style={{
    marginTop: '10px',
    marginLeft:"5px",
    padding: '8px 12px',
    backgroundColor: '#f39c12',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }}
>
  {editing ? 'Cancel Edit' : 'Edit Profile'}
</button>

<button
  onClick={handleDeleteUser}
  style={{
    marginTop: '10px',
    marginLeft: '5px',
    padding: '8px 12px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }}
>
  Delete Profile
</button>



    </div>
    
    {editing && (
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      try {
        const res = await axios.put(`http://localhost:5000/api/users/${username}/update`, formData);
        setUser(res.data.user);
        dispatch(cacheUser({ username, data: res.data.user }));
        setEditing(false);
        alert('User info updated ✅');
      } catch (err) {
        console.error(err);
        alert('Failed to update user ❌');
      }
    }}
    style={{
      padding: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      maxWidth: '500px',
      minWidth:"450px"
    }}
  >
    <h3 style={{margin:"auto"}}>Edit Profile</h3>
    <input
      type="text"
      placeholder="Location"
      value={formData.location}
      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      style={{
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
      }}
    />
    <input
      type="text"
      placeholder="Blog"
      value={formData.blog}
      onChange={(e) => setFormData({ ...formData, blog: e.target.value })}
      style={{
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
      }}
    />
    <textarea
      placeholder="Bio"
      value={formData.bio}
      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
      style={{
        padding: '12px',
        borderRadius: '10px',
        height: '100px',
        fontSize: '16px',
        border: '1px solid #ccc',
        outline: 'none',
        resize: 'vertical',
      }}
    />
    <button
      type="submit"
      style={{
        background: 'linear-gradient(90deg, #28a745, #218838)',
        color: '#fff',
        padding: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background =
          'linear-gradient(90deg, #20c997, #17a2b8)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background =
          'linear-gradient(90deg, #28a745, #218838)')
      }
    >
      Save Changes
    </button>
  </form>
)}




  </div>
)}



      <h3 style={{marginLeft:"15px"}}>Repositories</h3>
      <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    margin:"10px"
  }}
>
  {repos.map((repo) => (
    <div
      key={repo.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        backgroundColor: '#fff',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid #eee',
      }}
    >
      {/* Left: Icon */}
      <img
        src={getRepoIcon(repo)}
        alt="Repo Icon"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          objectFit: 'contain',
          backgroundColor: '#f5f5f5',
         }}
      />

      {/* Right: Name + Description */}
      <div>
        <Link
          to={`/repo/${username}/${repo.name}`}
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#0366d6',
            textDecoration: 'none',
          }}
        >
          {repo.name}
          <img 
          src="/assets/verified_symbol.png"
          alt="Verified"
          style={{
            width: "16px",
            height: "16px",
            verticalAlign: "middle",
            marginLeft: "4px",
          }}
          />
        </Link>
        <p style={{ fontSize: '14px', color: '#555', marginTop: '4px' }}>
          {repo.description || 'No description provided.'}
        </p>
      </div>
    </div>
  ))}
</div>


    </div>
  );
};

export default RepoListPage;
