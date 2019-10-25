const { SOURCES } = require("@cdt/sources");

function getModeleBody() {
  return {
    size: 1000,
    _source: ["title", "slug", "description", "editor", "filename"],
    sort: [{ position: { order: "asc" } }],
    query: {
      bool: {
        filter: [
          {
            term: {
              source: SOURCES.LETTERS
            }
          }
        ]
      }
    }
  };
}

module.exports = getModeleBody;
