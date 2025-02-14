import { useState, useEffect } from 'react';

const SearchBar = ({ user }) => {
  const [searchFriend, setSearchFriend] = useState('');
  
  const handleChange = async (e) => {
    setSearchFriend(e.target.value);
    
    try{
      let res = await fetch('http://localhost:8000/search-friend', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchFriend, user }),

      })
    }
    catch(err){
      console.log(err.message);
    }
  }
  return(
    <div className="bg-slate-700 m-4 rounded">
      <input
        type="text"
        placeholder="Search friends..."
        value={searchFriend}
        onChange={(e) => handleChange(e)}
        className="w-full p-2 bg-slate-600 text-white rounded-md focus:outline-none"
      />
    </div>
  );
}

export default SearchBar;
