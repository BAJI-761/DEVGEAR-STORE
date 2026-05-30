const IMAGE_SOURCES = {
  Keyboards: [
    '1595225476474-87563907a212',
    '1555532538-dcdbd01d3738',
    '1511467687858-23d96c32e4ae',
    '1618366712010-f4ae9c647dcb',
    '1605436247078-f0ef43ee8d5c'
  ],
  Monitors: [
    '1527443224154-c4a3942d3acf',
    '1542732816-72eb1a0673ed',
    '1586210579191-33b45e38fa2c',
    '1552831388-6a0b35077328',
    '1551645120-d70bfe84c826'
  ]
};

async function test() {
  for (const category in IMAGE_SOURCES) {
    for (const id of IMAGE_SOURCES[category]) {
      const url = `https://images.unsplash.com/photo-${id}?w=400&q=80&fm=jpg`;
      try {
        const res = await fetch(url, { method: 'HEAD' });
        console.log(`${category} - ${id}: ${res.status}`);
      } catch (err) {
        console.error(err);
      }
    }
  }
}
test();
