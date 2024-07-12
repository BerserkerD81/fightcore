import React, { useState, useEffect } from 'react';
import { addGameToDatabase, getGamesFromDatabase } from '../firebaseFuntions';

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({
    coverImage: '',
    title: '',
    description: '',
    console: '',
    jhh: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [jhhFilterOpen, setjhhFilterOpen] = useState(false);
  const [consoleFilterOpen, setConsoleFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    jhh: '',
    console: ''
  });

  useEffect(() => {
    const fetchGames = async () => {
      const gamesFromDB = await getGamesFromDatabase();
      setGames(gamesFromDB);
    };
    fetchGames();
  }, []);

  const togglejhhFilter = () => {
    setjhhFilterOpen(!jhhFilterOpen);
    setConsoleFilterOpen(false); // Cerrar el otro filtro si está abierto
  };

  const toggleConsoleFilter = () => {
    setConsoleFilterOpen(!consoleFilterOpen);
    setjhhFilterOpen(false); // Cerrar el otro filtro si está abierto
  };

  const handleFilterSelect = (type, value) => {
    setSelectedFilters({
      ...selectedFilters,
      [type]: value
    });
    // Cerrar ambos filtros al seleccionar uno
    setjhhFilterOpen(false);
    setConsoleFilterOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGame({ ...newGame, [name]: value });
  };

  const handleAddGame = async () => {
    try {
      await addGameToDatabase(newGame);
      const gamesFromDB = await getGamesFromDatabase();
      setGames(gamesFromDB);
      setNewGame({
        coverImage: '',
        title: '',
        description: '',
        console: '',
        jhh: ''
      });
    } catch (error) {
      console.error("Error adding game: ", error);
    }
  };

  // Función para filtrar los juegos según el término de búsqueda y los filtros seleccionados
  const filteredGames = games.filter((game) => {
    return (
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilters.jhh === '' || game.jhh === parseInt(selectedFilters.jhh)) &&
      (selectedFilters.console === '' || game.console === selectedFilters.console)
    );
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Game Library</h2>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Search by title..."
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filtros desplegables */}
      <div className="flex justify-center space-x-4 mb-4">
        {/* Menú desplegable para años */}
        <div className="relative">
          <button
            type="button"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md flex items-center justify-between"
            onClick={togglejhhFilter}
          >
            {selectedFilters.jhh ? `Year: ${selectedFilters.jhh}` : 'Year'}
            <svg
              className="h-5 w-5 text-white ml-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v10a1 1 0 01-1.447.895l-4-2a1 1 0 010-1.79l4-2A1 1 0 0110 3zm1 10a1 1 0 01-1 1H6a1 1 0 110-2h4a1 1 0 011 1zm-1-4a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {jhhFilterOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border border-gray-300 z-10">
              <div className="py-1">
                <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterSelect('jhh', '2019')}>
                  2019
                </div>
                <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterSelect('jhh', '2020')}>
                  2020
                </div>
                <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterSelect('jhh', '2021')}>
                  2021
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menú desplegable para consolas */}
        <div className="relative">
          <button
            type="button"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md flex items-center justify-between"
            onClick={toggleConsoleFilter}
          >
            {selectedFilters.console ? `Console: ${selectedFilters.console}` : 'Console'}
            <svg
              className="h-5 w-5 text-white ml-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v10a1 1 0 01-1.447.895l-4-2a1 1 0 010-1.79l4-2A1 1 0 0110 3zm1 10a1 1 0 01-1 1H6a1 1 0 110-2h4a1 1 0 011 1zm-1-4a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {consoleFilterOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border border-gray-300 z-10">
              <div className="py-1">
                <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterSelect('console', 'PlayStation 4')}>
                  PlayStation 4
                </div>
                <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterSelect('console', 'Xbox One')}>
                  Xbox One
                </div>
                <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterSelect('console', 'Nintendo Switch')}>
                  Nintendo Switch
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de juegos */}
      <div className="mt-8 overflow-y-auto max-h-96">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredGames.map((game) => (
            <div key={game.id} className="bg-black rounded-lg overflow-hidden shadow-md">
              <img src={game.coverImage} alt={game.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-lg">{game.title}</h4>
                <p className="text-gray-600 truncate">{game.description}</p>
                <p className="mt-2 text-gray-800">Console: {game.console}</p>
                <p className="text-gray-800">Year: {game.jhh}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameLibrary;



