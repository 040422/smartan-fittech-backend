import Database from "better-sqlite3";


const db = new Database("poseDB.sqlite", { verbose: console.log });


db.prepare(`
  CREATE TABLE IF NOT EXISTS poses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keypoints TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export const connectSQL = async () => {
  console.log("SQLite Database Connected (poseDB.sqlite)");
};

export const SQL = {
  create: ({ keypoints }) => {
    try {
      const stmt = db.prepare("INSERT INTO poses (keypoints) VALUES (?)");
      const result = stmt.run(keypoints);

      return { id: result.lastInsertRowid };
    } catch (err) {
      console.error("❌ SQLite Insert Error:", err);
      throw err;
    }
  },

    getAll: () => {
    return db.prepare("SELECT * FROM poses").all();
  },

  getById: (id) => {
    return db.prepare("SELECT * FROM poses WHERE id = ?").get(id);
  },

  update: (id, keypoints) => {
    return db.prepare("UPDATE poses SET keypoints = ? WHERE id = ?").run(keypoints, id);
  },

  delete: (id) => {
    return db.prepare("DELETE FROM poses WHERE id = ?").run(id);
  }

};
