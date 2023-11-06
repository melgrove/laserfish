const lookup = {
    '11': 7,
    '12': 6,
    '13': 5,
    '14': 4,
    '15': 5,
    '16': 4,
    '17': 5,
    '18': 4
};
const lookup2 = {

};

for(let n = 2; n <= 8; n++) {
    for(let m = n; m <= 8; m++) {
        let orig = lookup[`${n-1}${m-1}`];
        let curr = orig - 1;
        lookup[`${n}${m}`] = curr;
    }
}

for(let key in lookup) {
    let n = key[0];
    let m = key[1];
    let newKey = m + n;
    lookup[newKey] = lookup[key];
}

for(let key in lookup) {
    let n = parseInt(key[1]);
    let m = parseInt(key[0]);
    n = 9 - n;
    m = 9 - m;
    lookup2[`${n}${m}`] = lookup[key];
}


for(let n = 1; n <= 8; n++) {
    let str = "";
    for(let m = 1; m <= 8; m++) {
        str += `| ${lookup[`${9-n}${m}`]} `;
    }
    console.log(`${str}|\n`);
}
console.log("-----------------------------------------")
for(let n = 1; n <= 8; n++) {
    let str = "";
    for(let m = 1; m <= 8; m++) {
        str += `| ${lookup2[`${9-n}${m}`]} `;
    }
    console.log(`${str}|\n`);
}



console.log(lookup);
console.log(lookup2);