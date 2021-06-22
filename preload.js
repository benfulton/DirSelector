// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  let msg = localStorage.getItem('selection');
  let recent_dirs = document.querySelector("#recent-directories");
  if (msg) {
    var st = JSON.parse(msg);
    st.forEach((item) => {
      var option = document.createElement("option");
      option.text = item;
      recent_dirs.add(option);
    })
    recent_dirs.selectedIndex = 0;
  }
  else
  {
    recent_dirs.style.display = 'none'
  }

  document.querySelector("#recent-directories").onkeypress = function (e) {
    e.preventDefault();
    if (e.which === 13) {
      ipcRenderer.send('selected-dir', this.value)
    }
  }
})

const { ipcRenderer } = require('electron')

process.once('loaded', () => {
  window.addEventListener('message', evt => {
    if (evt.data.type === 'select-dirs') {
      ipcRenderer.send('select-dirs')
    }
  })
})

ipcRenderer.on('dirsel', (event, sel) => {
  let recent_dirs = document.querySelector("#recent-directories");
  current_list = Array.from(recent_dirs.options).map((opt) => opt.value);
  current_list.push(sel);
  localStorage.setItem('selection', JSON.stringify(current_list));
  ipcRenderer.send('selected-dir', sel[0])
})
