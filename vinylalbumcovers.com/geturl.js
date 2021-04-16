
function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

let a = [];
let elements = document.getElementsByTagName('img');
for (let i = 0; i < elements.length; i++) {
  a.push(elements[i].srcset);
}
let b = [];
for (let i = 0; i < a.length; ++i) {
  const regex = new RegExp(/https:\/\/vinylalbumcovers\.com\/wp-content\/uploads\/[a-zA-Z0-9\/\.]+ /);
  if (regex.test(a[i])) {
    // console.log(a[i], a[i].match(regex));
    b.push(a[i].match(regex)[0]);
  }
}
let c = [];
for (let i = 0; i < b.length; ++i) {
  c.push(b[i].substr(0, b[i].length-1));
}
let d = '';
for (let i = 0; i < c.length; ++i) {
  d += c[i] + '\n';
}
download("urls.txt", d);
