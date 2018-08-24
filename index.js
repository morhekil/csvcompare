const csv = require('csv');
const fs = require('fs');
const process = require('process');
const parse = require('csv-parse/lib/sync');

console.log("Reading file 1 from ", process.argv[2]);
const f1 = fs.readFileSync(process.argv[2]).toString();
console.log("Reading file 2 from ", process.argv[3]);
const f2 = fs.readFileSync(process.argv[3]).toString();

const data1 = parse(f1, { relax_column_count: true });
const data2 = parse(f2, { relax_column_count: true });

const out1 = [];
const out2 = [];

const compare = (a1, a2) => {
  let out = [];
  for(let i = 0; i < a1.length; i++) {
    out.push(a1[i] == a2[i] ? "" : a1[i]);
  }
  return out;
}

const writeCSV = (path, data) => csv.stringify(data, (err, csvstring) => {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  fs.writeFileSync(path, csvstring);
});

for (let i = 0; i < Math.max(data1.length, data2.length); i++) {
  out1.push(compare(data1[i] || [], data2[i] || []));
  out2.push(compare(data2[i] || [], data1[i] || []));
}


const f1out = "out/1.csv";
const f2out = "out/2.csv";

console.log("Writing file 1 differences into ", f1out);
writeCSV(f1out, out1);
console.log("Writing file 1 differences into ", f2out);
writeCSV(f2out, out2);
