const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'May',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const formatDate = (timestamp) => {
  const d = new Date(timestamp);

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${[date, month, year].join(' ')}`;
};

const getDate = (timestamp) => {
  const d = new Date(timestamp);

  return d.getDate();
};

export default {formatDate, getDate};
