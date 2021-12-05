const findWhat = (id, what) => {
  id = parseInt(id);
  const item = what.find((w) => w.id === id);
  return item;
};

module.exports = findWhat;
