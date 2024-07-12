import React, { useState, useEffect } from 'react';
import { addGameToDatabase, getGamesFromDatabase } from '../firebaseFuntions';
import { mostrarJuegos } from '../../firebaseFuntions';

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
    console.log("TIPO: "+type+" "+value)
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

  const handleGames = async () => {
    const filterGames = await mostrarJuegos();
    setGames(filterGames);
  }
  
  // Función para filtrar los juegos según el término de búsqueda y los filtros seleccionados
  const filteredGames = games.filter((game) => {
    return (
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilters.jhh === '' || game.jhh === selectedFilters.jhh) &&
      (selectedFilters.console === '' || game.console === selectedFilters.console)
    );
  });

  const uniqueYears = [...new Set(games.map(option => option.jhh))];
  const uniqueConsole = [...new Set(games.map(option => option.console))];

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
        <select
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-md flex items-center justify-between"
          value={selectedFilters.jhh}
          onChange={(e) => handleFilterSelect('jhh', e.target.value)}
        >
          <option value="">Año de salida</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
          </option>
          ))}
        </select>
      </div>
        {/* Menú desplegable para consolas */}
        <div className="relative">
        <select
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-md flex items-center justify-between"
          value={selectedFilters.console}
          onChange={(e) => handleFilterSelect('console', e.target.value)}
        >
          <option value="">Consola</option>
          {uniqueConsole.map((console) => (
            <option key={console} value={console}>
              {console}
            </option>
          ))}
        </select>
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



