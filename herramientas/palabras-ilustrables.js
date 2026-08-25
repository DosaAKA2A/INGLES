/* Que palabras del curso llevan ilustracion, y QUE se dibuja en cada una.
   No se ilustra todo: los numeros se leen mejor como cifra, y las abstractas
   (and, but, always, of course) no tienen dibujo honesto — para esas la ficha
   se queda con su icono y ya.

   La clave es la palabra tal cual aparece en el vocabulario (en minusculas);
   el valor es el SUJETO del dibujo, en ingles, sin estilo: el estilo lo pone
   genera-imagenes.py igual para todas, que es lo que hace que el set case.

   Uso: node herramientas/palabras-ilustrables.js  -> escribe sujetos.json */

const SUJETOS = {
  // --- u01 personas y cortesia ---
  'friend': 'two friends smiling side by side, waving',
  'teacher': 'a teacher standing next to a blackboard, holding a book',
  'good morning': 'a bright sun rising over a horizon with a coffee cup',
  'good night': 'a crescent moon and stars over a sleeping bed',

  // --- u03 lugares ---
  'country': 'a globe of the world on a stand',
  'city': 'a city skyline with tall buildings',
  'spain': 'the flag of Spain waving on a pole',
  'england': 'the flag of England waving on a pole',
  'the united states': 'the flag of the United States waving on a pole',
  'mexico': 'the flag of Mexico waving on a pole',
  'peru': 'the flag of Peru waving on a pole',
  'japan': 'the flag of Japan waving on a pole',
  'brazil': 'the flag of Brazil waving on a pole',
  'language': 'two speech bubbles overlapping, one with a letter A and one with a different alphabet character',

  // --- u04 familia ---
  'family': 'a family of four standing together, parents and two children',
  'mother': 'a mother holding her small child',
  'father': 'a father carrying his small child on his shoulders',
  'parents': 'a mother and a father standing together',
  'brother': 'two boys standing together as brothers',
  'sister': 'two girls standing together as sisters',
  'son': 'a young boy waving',
  'daughter': 'a young girl waving',
  'children': 'three small children playing together',
  'grandmother': 'an elderly woman with grey hair and glasses, smiling',
  'grandfather': 'an elderly man with grey hair and a moustache, smiling',
  'uncle': 'a grown man in a casual shirt waving hello',
  'aunt': 'a grown woman in a casual dress waving hello',
  'cousin': 'two young cousins standing side by side',
  'husband': 'a married man wearing a wedding ring, smiling',
  'wife': 'a married woman wearing a wedding ring, smiling',
  'dog': 'a friendly dog sitting, tongue out',
  'cat': 'a cat sitting with its tail curled',
  'old': 'an elderly person with a walking cane',
  'young': 'a young child jumping happily',

  // --- u05 objetos ---
  'book': 'a closed hardcover book',
  'pen': 'a ballpoint pen',
  'phone': 'a modern smartphone',
  'computer': 'a laptop computer, open',
  'key': 'a single door key',
  'bag': 'a backpack',
  'chair': 'a wooden chair',
  'table': 'a wooden table',
  'door': 'a closed wooden door with a handle',
  'window': 'a window with open curtains',
  'car': 'a small car seen from the side',
  'house': 'a small house with a roof, door and two windows',
  'water': 'a glass of water',
  'coffee': 'a steaming cup of coffee',
  'apple': 'a red apple with a green leaf',
  'orange': 'an orange fruit with a leaf',
  'egg': 'two eggs, one whole and one cracked open',
  'umbrella': 'an open umbrella',
  'watch': 'a wristwatch',
  'glass': 'an empty drinking glass',
  'box': 'a cardboard box, open',
  'big': 'a large elephant next to a tiny mouse, showing size difference',
  'small': 'a tiny mouse next to a large elephant, the mouse in focus',

  // --- u06 verbos de rutina ---
  'work': 'a person working at a desk with a laptop',
  'live': 'a person standing in the doorway of their home',
  'eat': 'a person eating a meal with a fork',
  'drink': 'a person drinking from a glass',
  'go': 'a person walking away, with an arrow pointing forward',
  'get up': 'a person getting out of bed in the morning, stretching',
  'sleep': 'a person sleeping in bed with closed eyes',
  'study': 'a person studying at a desk with books',
  'play': 'two children playing with a ball',
  'read': 'a person reading an open book',
  'listen to': 'a person wearing headphones, listening to music',
  'speak': 'a person talking with a speech bubble',
  'cook': 'a person cooking at a stove with a pan',
  'clean': 'a person cleaning a table with a cloth',
  'buy': 'a person paying at a shop counter with a shopping bag',
  'walk': 'a person walking',
  'run': 'a person running fast',
  'school': 'a school building with a flag',
  'music': 'musical notes and a pair of headphones',
  'breakfast': 'a breakfast plate with eggs, toast and orange juice',
  'dinner': 'a dinner plate with a served meal and cutlery',

  // --- u07 oficios y tiempo ---
  'early': 'an alarm clock ringing at sunrise',
  'late': 'a person running while looking at a wristwatch',
  'together': 'two people holding hands',
  'alone': 'one person sitting by themselves on a bench',
  'doctor': 'a doctor in a white coat with a stethoscope',
  'student': 'a student with a backpack and notebooks',
  'office': 'an office with desks and computers',
  'weekend': 'a calendar page with Saturday and Sunday circled',
  'teach': 'a teacher pointing at a blackboard explaining to a student',
  'wash': 'hands washing a plate under running water',

  // --- u08 tiempo ---
  'birthday': 'a birthday cake with lit candles',
  'class': 'a classroom with a teacher and students at desks',
  'week': 'a weekly calendar page',
  'month': 'a monthly calendar page',

  // --- u09 comida ---
  'food': 'a table full of different dishes of food',
  'bread': 'a loaf of bread with a slice cut',
  'cheese': 'a wedge of yellow cheese with holes',
  'meat': 'a grilled steak on a plate',
  'chicken': 'a roasted chicken on a plate',
  'fish': 'a whole cooked fish on a plate with a lemon slice',
  'rice': 'a bowl of white rice',
  'salad': 'a bowl of green salad with tomatoes',
  'fruit': 'a bowl with different fruits: banana, grapes and apple',
  'vegetables': 'a group of vegetables: carrot, broccoli and pepper',
  'onion': 'a whole onion with dry skin',
  'potato': 'two brown potatoes',
  'milk': 'a glass of milk next to a milk bottle',
  'juice': 'a glass of orange juice with a straw',
  'tea': 'a cup of tea with a tea bag',
  'beer': 'a glass of beer with foam',
  'cake': 'a slice of layered cake on a plate',
  'ice cream': 'an ice cream cone with two scoops',
  'chocolate': 'a chocolate bar with a piece broken off',
  'pizza': 'a pizza with one slice being lifted',
  'cooking': 'a person cooking, stirring a pot on the stove',
  'dancing': 'two people dancing together',
  'reading': 'a person sitting in a chair reading a book',
  'delicious': 'a person tasting food with a delighted expression',

  // --- u10 casa ---
  'room': 'a simple furnished room',
  'bedroom': 'a bedroom with a bed, lamp and window',
  'bathroom': 'a bathroom with a sink, mirror and shower',
  'kitchen': 'a kitchen with a stove, sink and cupboards',
  'living room': 'a living room with a sofa and a television',
  'garden': 'a garden with grass, flowers and a small tree',
  'bed': 'a made bed with pillows',
  'sofa': 'a two-seat sofa with cushions',
  'lamp': 'a table lamp turned on',
  'television': 'a flat screen television on a stand',
  'fridge': 'a closed refrigerator',
  'shower': 'a shower head with running water',
  'wall': 'a brick wall',
  'floor': 'a wooden floor seen in perspective',
  'picture': 'a framed picture hanging on a wall',
  'plant': 'a green potted plant',
  'in': 'a small ball inside an open box',
  'on': 'a small ball resting on top of a closed box',
  'under': 'a small ball underneath a table',
  'next to': 'a small ball beside a box, at its side',
  'behind': 'a ball peeking out from behind a box',
  'in front of': 'a ball placed in front of a box',
  'between': 'a ball placed between two boxes',

  // --- u11 habilidades ---
  'swim': 'a person swimming in water',
  'drive': 'a person driving a car, hands on the wheel',
  'dance': 'a person dancing with arms raised',
  'sing': 'a person singing into a microphone',
  'draw': 'a hand drawing on paper with a pencil',
  'paint': 'a hand painting a canvas with a brush',
  'ride a bike': 'a person riding a bicycle',
  'play the guitar': 'a person playing an acoustic guitar',
  'play soccer': 'a person kicking a soccer ball',
  'jump': 'a person jumping in the air',
  'fly': 'a bird flying with open wings',
  'help': 'one person helping another up by the hand',
  'open': 'a door being opened, swinging outward',
  'close': 'a door being closed',
  'see': 'a large open eye',
  'hear': 'an ear with sound waves coming toward it',
  'remember': 'a person thinking with a thought bubble showing a memory',

  // --- u12 ropa, lugares y animo ---
  'wait': 'a person waiting at a bus stop, looking at a watch',
  'rain': 'rain falling from a dark cloud',
  'wear': 'a person putting on a jacket',
  'jacket': 'a zipped jacket',
  'shoes': 'a pair of sneakers',
  'shirt': 'a button-up shirt',
  't-shirt': 'a plain t-shirt',
  'pants': 'a pair of trousers',
  'hat': 'a cap',
  'look for': 'a person searching with a magnifying glass',
  'talk': 'two people talking with speech bubbles',
  'write': 'a hand writing in a notebook with a pen',
  'learn': 'a person studying with an open book and a lightbulb above',
  'sit': 'a person sitting on a chair',
  'stand': 'a person standing upright',
  'smile': 'a person smiling widely',
  'cry': 'a person crying with a tear on the cheek',
  'bus': 'a city bus seen from the side',
  'street': 'a street with buildings and a crossing',
  'park': 'a park with trees, a bench and grass',
  'happy': 'a person with a big happy smile, arms up',
  'sad': 'a person looking sad with shoulders down',
  'tired': 'a person yawning, looking exhausted',
  'busy': 'a person overwhelmed with papers and tasks'
};

if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  fs.writeFileSync(path.join(__dirname, '..', 'sujetos.json'), JSON.stringify(SUJETOS, null, 1));
  console.log('palabras ilustrables:', Object.keys(SUJETOS).length);
}

module.exports = SUJETOS;
