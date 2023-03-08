import { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { debounce } from '../helpers/searchHelper.js';

function Search({ search, setSearch, setItems, items, spotifyApi, setActiveIndex }) {
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    if (value === '') {
      debouncedSearch.cancel();
      setItems([]);
    } else {
      debouncedSearch(value);
    }
  };

  const debouncedSearch = debounce(async (searchValue) => {
    try {
      if (spotifyApi) {
        const data = await spotifyApi.searchTracks(searchValue);
        let { items } = data?.body?.tracks;
        setItems(items);
        setActiveIndex(0);
      }
    } catch (err) {
      console.error(err);
    }
  }, 500);

  const handleBlur = () => {};

  useHotkeys(
    'meta+a',
    () => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, inputRef.current.value.length);
      }
    },
    { preventDefault: true }
  );

  useHotkeys(
    'tab',
    () => {
      if (inputRef.current) {
        inputRef?.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
      }
    },
    { preventDefault: true }
  );

  return (
    <div className="searchContainer">
      <input
        placeholder="Search for your favourite songs, lyrics..."
        className="searchBar"
        spellCheck={false}
        ref={inputRef}
        value={search}
        autoFocus
        onBlur={() => setTimeout(() => inputRef.current.focus(), 0)}
        onChange={(e) => handleSearch(e)}
      />
      <kbd className="!ml-4">cmd</kbd>
      <kbd>/</kbd>
    </div>
  );
}

export default Search;
