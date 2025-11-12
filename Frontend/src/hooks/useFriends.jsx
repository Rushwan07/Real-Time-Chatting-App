// src/hooks/useFriends.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function useFriends() {
  const [friends, setFriends] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const { user, token } = useSelector(
    (state) => state?.user?.user || { user: null, token: null }
  );

  // Fetch user's friends
  useEffect(() => {
    if (!token) return;

    const fetchFriends = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/friends`, {
          headers: { token },
        });
        setFriends(res.data.friends || []);
        setAllFriends(res.data.friends || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [token]);

  // Handle searching users
  useEffect(() => {
    if (!token) return;

    const fetchSearchResults = async () => {
      if (!searchInput.trim()) {
        // If search input is empty, just show friends
        setFriends(allFriends);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/users/search?query=${encodeURIComponent(searchInput)}`,
          {
            headers: { token },
          }
        );

        const searchUsers = res.data.users || [];

        // Combine friends + search results (no duplicates)
        const merged = [...allFriends];
        searchUsers.forEach((user) => {
          if (!merged.find((f) => f._id === user._id)) merged.push(user);
        });

        // Sort so exact matches come first
        // Sort so better matches appear first
        const sorted = merged.sort((a, b) => {
          const normalize = (str) => str?.toLowerCase() || "";
          const query = searchInput.toLowerCase();

          const aName = normalize(a.name);
          const aUsername = normalize(a.username);
          const bName = normalize(b.name);
          const bUsername = normalize(b.username);

          // Scoring function
          const score = (name, username) => {
            if (name === query || username === query) return 3; // exact match
            if (name.startsWith(query) || username.startsWith(query)) return 2; // starts with
            if (name.includes(query) || username.includes(query)) return 1; // partial match
            return 0;
          };

          const scoreA = score(aName, aUsername);
          const scoreB = score(bName, bUsername);

          return scoreB - scoreA; // higher score first
        });

        setFriends(sorted);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search for better UX (like Instagram)
    const delay = setTimeout(fetchSearchResults, 400);
    return () => clearTimeout(delay);
  }, [searchInput, token, allFriends]);

  return { friends, loading, error, searchInput, setSearchInput };
}
