const getServer = (data) => {
  switch (data) {
    case 'daily':
      return 'https://rfzsal.github.io/pirus-data/api/daily';
    case 'province':
      return 'https://rfzsal.github.io/pirus-data/api/province';
    case 'news':
      return 'https://rfzsal.github.io/pirus-data/api/news';
    case 'hospitals':
      return 'https://rfzsal.github.io/pirus-data/api/hospitals';
  }
};

export default getServer;
