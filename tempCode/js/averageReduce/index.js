const victorianSlang = [
  {
    term: 'doing the bear',
    found: true,
    popularity: 108,
  },
  {
    term: 'katterzem',
    found: false,
    popularity: null,
  },
  {
    term: 'bone shaker',
    found: true,
    popularity: 609,
  },
  {
    term: 'smothering a parrot',
    found: false,
    popularity: null,
  },
  {
    term: 'damfino',
    found: true,
    popularity: 232,
  },
  {
    term: 'rain napper',
    found: false,
    popularity: null,
  },
  {
    term: 'donkey’s breakfast',
    found: true,
    popularity: 787,
  },
  {
    term: 'rational costume',
    found: true,
    popularity: 513,
  },
  {
    term: 'mind the grease',
    found: true,
    popularity: 154,
  },

];

/**
 * filter返回数组
 * @type {*[]}
 */
const a1 = victorianSlang.filter(({found})=>found)
const average1 = a1.map(({popularity})=>popularity).reduce((cur,next)=>cur+next,0)/a1.length
console.log(average1);

/**
 *
 * @type {any}
 */
const obj = victorianSlang
  .filter(({found})=>found)
  .map(({popularity})=>popularity)
  .reduce(({sum, count}, cur)=>({
    sum: sum + cur,
    count: count + 1,
  }), {sum: 0, count: 0});

const average2 = obj.sum / obj.count;
console.log("Average popularity:", average2);


// Helpers
// ----------------------------------------------------------------------------
const filter  = p => a => a.filter(p);
const map     = f => a => a.map(f);
const prop    = k => x => x[k];
const reduce  = r => i => a => a.reduce(r, i);
const compose = (...fns) => (arg) => fns.reduceRight((arg, fn) => fn(arg), arg);

// The blackbird combinator.
// See: https://jrsinclair.com/articles/2019/compose-js-functions-multiple-parameters/
const B1 = f => g => h => x => f(g(x))(h(x));

// Calculations
// ----------------------------------------------------------------------------

// We'll create a sum function that adds all the items of an array together.
const sum = reduce((a, i) => a + i)(0);

// A function to get the length of an array.
const length = a => a.length;

// A function to divide one number by another.
const div = a => b => a / b;

// We use compose() to piece our function together using the small helpers.
// With compose() you read from the bottom up.
const calcPopularity = compose(
  B1(div)(sum)(length),
  map(prop('popularity')),
  filter(prop('found')),
);

const average3 = calcPopularity(victorianSlang);
console.log("Average popularity:", average3);

