import { useEffect, useState } from 'react';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import SearchBar from '../SearchBar';
import MovieGrid from '../MovieGrid';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import MovieModal from '../MovieModal';

import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        setMovies([]);

        const results = await fetchMovies(query);

        if (results.length === 0) {
          toast('No movies found for your request.');
        }

        setMovies(results);
      } catch (err) {
        setError(true);
        toast.error('Something went wrong!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const handleSearch = (formData: FormData) => {
    const newQuery = formData.get('query')?.toString().trim() || '';
    if (!newQuery) {
      toast.error('Please enter your search query.');
      return;
    }
    setQuery(newQuery);
    setPage(1);
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const shouldShowGrid =
    !isLoading && !isError && data && data.results.length > 0;

  return (
    <div>
      <SearchBar action={handleSearch} />
      <Toaster />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {shouldShowGrid && <MovieGrid movies={movies} onSelect={handleSelect} />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;



