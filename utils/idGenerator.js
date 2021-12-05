const idGenerator = (range = [], listOfIds = []) => {
  const id = Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
  if (listOfIds.includes(id)) {
    idGenerator(range, listOfIds);
  }
  return id;
};

module.exports = idGenerator;
