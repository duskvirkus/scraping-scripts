// gucci.com get urls women's garments scripts

let a = [];
let elements = document.getElementsByClassName('carousel-image-wrapper');
for (let i = 0; i < elements.length; i++) {
  a.push(elements[i].children[0].src);
}
let b = '';
for (let i = 0; i < a.length; i++) {
  if (a[i].length > 0 && a[i].match('style')) {
    let c = `${a[i].replace(/\w+_\d+x\d+/, 'DarkGray_Center_0_0_2400x2400')}\n`;
    for (let j = 0; j < 24; j++) {
      let jf = j.toString();
      while (jf.length < 3) {
        jf = '0' + jf;
      }
      c = c.replace(/(\w+_)(\d\d\d\d_)\d\d\d/, '$1$2' + jf);
      b += c;
    }
  }
}
console.log(b);