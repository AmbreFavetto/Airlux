const QUERY = {
    SELECT_DEVISES: 'SELECT * FROM devises ORDER BY created_at DESC LIMIT 100',
    SELECT_DEVISE: 'SELECT * FROM devises WHERE id = ?',
    CREATE_DEVISE: 'INSERT INTO devises(name, type, roomID, floorID, batID) VALUES (?, ?, ?, ?, ?)',
    UPDATE_DEVISE: 'UPDATE devises SET name = ?, type = ?, roomID = ?, floorID = ?, batID = ? WHERE id = ?',
    DELETE_DEVISE: 'DELETE FROM devises WHERE id = ?',
    CREATE_DEVISE_PROCEDURE: 'CALL create_and_return(?, ?, ?)'
  };
  
  export default QUERY;



  //DEVICE + BATIMENT + USER
  // user : nom prenom email mdp(argon2) isAdmin batID
  ///Bat: name 
  ///floor: name batID
  ///room : name floorID batID