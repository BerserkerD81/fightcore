import React, { useState } from 'react';

const GameLibrary = () => {
  const [games, setGames] = useState([
    {
      id: 1,
      coverImage: 'https://via.placeholder.com/150',
      title: 'Game 1',
      description: 'Description for Game 1',
      console: 'PlayStation 4',
      jhh: 2019
    },
    {
      id: 2,
      coverImage: 'https://via.placeholder.com/150',
      title: 'Game 2',
      description: 'Description for Game 2',
      console: 'Xbox One',
      jhh: 2020
    },
    {
      id: 3,
      coverImage: 'https://via.placeholder.com/150',
      title: 'Game 3',
      description: 'Description for Game 3',
      console: 'Nintendo Switch',
      jhh: 2021
    }
    // Agrega más juegos según sea necesario
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [jhhFilterOpen, setjhhFilterOpen] = useState(false);
  const [consoleFilterOpen, setConsoleFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    jhh: '',
    console: ''
  });

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

  // Función para filtrar los juegos según el término de búsqueda y los filtros seleccionados
  const filteredGames = games.filter((game) => {
    return (
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilters.jhh === '' || game.jhh === parseInt(selectedFilters.jhh)) &&
      (selectedFilters.console === '' || game.console === selectedFilters.console)
    );
  });

  return (
    <div className="text-center h-screen flex flex-col justify-start">
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
      <div className="flex justify-center">
        {/* Menú desplegable para años */}
        <div className="relative ml-4">
          <div className="content-custom border border-white rounded-md">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 content-custom text-sm font-medium text-white hover:content-custom focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={togglejhhFilter}
            >
              jhh {selectedFilters.jhh && `: ${selectedFilters.jhh}`}
              {/* Icono de flecha abajo */}
              <svg
                className="-mr-1 ml-2 h-5 w-5 text-white"
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
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg content-custom border border-white ring-1 ring-white ring-opacity-5 z-10">
              <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div className="px-4 py-2 text-sm text-white hover:bg-gray-800" role="menuitem" onClick={() => handleFilterSelect('jhh', '2019')}>
                  2019
                </div>
                <div className="px-4 py-2 text-sm text-white hover:content-custom" role="menuitem" onClick={() => handleFilterSelect('jhh', '2020')}>
                  2020
                </div>
                <div className="px-4 py-2 text-sm text-white hover:content-custom" role="menuitem" onClick={() => handleFilterSelect('jhh', '2021')}>
                  2021
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menú desplegable para consolas */}
        <div className="relative ml-4">
          <div className="content-custom border border-white rounded-md">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 content-custom text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={toggleConsoleFilter}
            >
              Console {selectedFilters.console && `: ${selectedFilters.console}`}
              {/* Icono de flecha abajo */}
              <svg
                className="-mr-1 ml-2 h-5 w-5 text-white"
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
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg content-custom border border-white ring-1 ring-white ring-opacity-5 z-10">
              <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div className="px-4 py-2 text-sm text-white hover:bg-gray-800" role="menuitem" onClick={() => handleFilterSelect('console', 'PlayStation 4')}>
                  PlayStation 4
                </div>
                <div className="px-4 py-2 text-sm text-white hover:bg-gray-800" role="menuitem" onClick={() => handleFilterSelect('console', 'Xbox One')}>
                  Xbox One
                </div>
                <div className="px-4 py-2 text-sm text-white hover:bg-gray-800" role="menuitem" onClick={() => handleFilterSelect('console', 'Nintendo Switch')}>
                  Nintendo Switch
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de juegos filtrados */}
      <div className="flex justify-center mt-8">
        <div className="max-w-md overflow-x-auto whitespace-nowrap">
          {filteredGames.map(game => (
            <div key={game.id} className="inline-block p-4 mb-8" style={{ minHeight: '300px' }}>
              <img
                src={game.coverImage}
                alt={game.title}
                className="mx-auto rounded-lg"
                style={{ width: '150px', height: '150px' }}
              />
              <div className="text-center">
                <h3 className="text-lg font-bold mt-2">{game.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{game.description}</p>
                <p className="text-sm text-gray-600 mt-2">{game.console} - {game.jhh}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameLibrary;
