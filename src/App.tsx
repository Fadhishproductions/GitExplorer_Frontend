import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import Header from './components/Header';
import RepoListPage from './pages/RepoListPage';
import RepoDetailPage from './pages/RepoDetailPage';
import FollowersPage from './pages/FollowersPage';
function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:username" element={<RepoListPage />} />
        <Route path="/repo/:username/:reponame" element={<RepoDetailPage />} />
        <Route path="/user/:username/followers" element={<FollowersPage />} />
      </Routes>
    </div>
  );
}

export default App;
