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
    <div className="container text-center h-screen flex flex-col justify-start">
      <h2 className="text-2xl font-bold mt-4">Game Library</h2>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Search by title..."
        className="my-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100 text-gray-800"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filtros desplegables */}
      <div className="flex justify-center space-x-4">
        {/* Menú desplegable para años */}
        <div className="relative">
          <div className="border rounded-md">
            <button
              type="button"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md flex items-center justify-between"
              onClick={togglejhhFilter}
            >
              {selectedFilters.jhh ? `Year: ${selectedFilters.jhh}` : 'Year'}
              {/* Icono de flecha abajo */}
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
          </div>
          {/* Contenido del filtro de años */}
          {jhhFilterOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 border border-gray-900 text-white z-10">
              <div className="py-1">
                <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleFilterSelect('jhh', '2019')}>
                  2018
                </div>
                <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleFilterSelect('jhh', '2020')}>
                  2020
                </div>
                <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleFilterSelect('jhh', '2021')}>
                  2023
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menú desplegable para consolas */}
        <div className="relative">
          <div className="border rounded-md">
            <button
              type="button"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md flex items-center justify-between"
              onClick={toggleConsoleFilter}
            >
              {selectedFilters.console ? `Console: ${selectedFilters.console}` : 'Console'}
              {/* Icono de flecha abajo */}
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
          </div>
          {/* Contenido del filtro de consolas */}
          {consoleFilterOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 border border-gray-900 text-white z-10">
              <div className="py-1">
                <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleFilterSelect('console', 'PlayStation 4')}>
                  PlayStation 4
                </div>
                <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleFilterSelect('console', 'Xbox One')}>
                  Xbox One
                </div>
                <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleFilterSelect('console', 'Nintendo Switch')}>
                  Nintendo Switch
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulario para agregar un nuevo juego */}
      {/* <div className="mt-8">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
          onClick={handleAddGame}
        >
          Add New Game
        </button>
        {/* Campos para agregar un juego */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Cover Image URL"
            name="coverImage"
            className="my-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100 text-gray-800"
            value={newGame.coverImage}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Title"
            name="title"
            className="my-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100 text-gray-800"
            value={newGame.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Description"
            name="description"
            className="my-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100 text-gray-800"
            value={newGame.description}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Console"
            name="console"
            className="my-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100 text-gray-800"
            value={newGame.console}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Year"
            name="jhh"
            className="my-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100 text-gray-800"
            value={newGame.jhh}
            onChange={handleInputChange}
          />
        </div>
      </div> */}

      {/* Lista de juegos */}
      <div className="overflow-y-auto mt-8">
        <h3 className="text-xl font-bold mb-4">Games</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredGames.map((game) => (
            <div key={game.id} className="bg-white rounded-lg overflow-hidden shadow-md h-96">
              <img src={game.coverImage} alt={game.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-lg">{game.title}</h4>
                <p className="text-gray-600">{game.description}</p>
                <p className="mt-2">Console: {game.console}</p>
                <p>Year: {game.jhh}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameLibrary;

