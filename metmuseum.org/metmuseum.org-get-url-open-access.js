// metmuseum.org get urls open access scripts

let a = [];
for (let i = 0; i < document.getElementsByClassName('result-card__image--art').length; i++) {
  a.push(document.getElementsByClassName('result-card__image--art')[i].src.replace('mobile-large', 'original'));
}
let b = '';
for (let i = 0; i < a.length; i++) {
  b += a[i] + '\n';
}
console.log(b);