import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { cacheFollowers } from '../redux/userSlice';

const FollowersPage = () => {
    const { username = ''} = useParams<{ username: string }>();
    const cachedFollowers = useSelector((state: RootState) => state.user.followers[username.toLowerCase()]);
  
  const [followers, setFollowers] = useState<any[]>(cachedFollowers || []);
    const navigate = useNavigate();
    const dispatch = useDispatch()
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        if (!cachedFollowers) {
            const res = await axios.get(`https://api.github.com/users/${username}/followers`);
            setFollowers(res.data);
            dispatch(cacheFollowers({ username, data: res.data }));
          }
          
      } catch (err) {
        console.error(err);
      }
    };
    fetchFollowers();
  }, [username]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Followers of {username}</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
      }}>
        {followers.map((follower) => (
          <div key={follower.id}
            onClick={() => navigate(`/user/${follower.login}`)}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              backgroundColor: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <img
              src={follower.avatar_url}
              alt={follower.login}
              width={80}
              height={80}
              style={{ borderRadius: '50%' }}
            />
            <p style={{ marginTop: '10px' }}>{follower.login}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowersPage;
