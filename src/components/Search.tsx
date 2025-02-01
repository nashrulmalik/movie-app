import React from 'react'

interface SearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
        <div>
        <img src="search.svg" alt="search"/>
        <input
            type="text"
            placeholder='Search through thousans of movies'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
        />
        </div>
    </div>
  )
}

export default Search