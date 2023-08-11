const buttons = document.querySelectorAll('button');
const dialogs = document.querySelectorAll('.dialog');

const fieldsMap = {
  // storage key, elements class to render
  ridesValue: '#ridesValueElement',
  name: '.nameValueElement',
  number: '.numberValueElement',
};

const validator = {
  set(obj, prop, value) {
    const toBeFilled = Boolean(fieldsMap[prop]);

    if (toBeFilled === true) {
      document.querySelectorAll(fieldsMap[prop]).forEach((element) => {
        element.textContent = value;
      });
    }

    obj[prop] = value;

    return true;
  },
};

const data = new Proxy({}, validator);

const watchInputs = {
  // storage key, input id
  name: 'input-name',
  number: 'input-number',
};

Object.entries(watchInputs).forEach(([storageKey, inputId]) => {
  const input = document.getElementById(inputId);

  if (input === undefined) {
    return alert(`Input with id ${inputId} not found`);
  }

  input.addEventListener('input', (event) => {
    const { value } = event.target;

    data[storageKey] = value;
  });
});

const showDialog = (dialogId) => {
  dialogs.forEach((dialog) => {
    const id = dialog.id;

    if (id === dialogId) {
      return (dialog.style.display = 'block');
    }

    dialog.style.display = 'none';
  });
};

buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const { dataset } = event.target;

    const { save, next } = dataset;

    if (save !== undefined) {
      const [key, value] = save.split('-');

      if (key === undefined || value === undefined) {
        return alert('No key or value in data-save');
      }

      data[key] = value;
    }

    showDialog(next);
  });
});

// Phone number mask

document.getElementById('input-number').addEventListener('input', function (e) {
  const x = e.target.value
    .replace(/\D/g, '')
    .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  e.target.value = !x[2]
    ? x[1]
    : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
});

// fireworks-js

const container = document.querySelector('.fireworks-container')
const fireworks = new Fireworks(container, { /* options */ })

// the end | Safe results to local storage + fireworks

const statsLocalStorageKey = '__delete_tinder_data';

document
  .querySelector('button[data-next="dialog5"]')
  .addEventListener('click', () => {
    fireworks.start();

    setTimeout(() => {
      fireworks.stop();
    }, 15_000);

    const previousDataJSON = localStorage.getItem(statsLocalStorageKey);
    const previousData =
      previousDataJSON === null ? null : JSON.parse(previousDataJSON);

    data.date = new Date();

    if (previousData === null) {
      localStorage.setItem(statsLocalStorageKey, JSON.stringify([data]));

      return;
    }

    localStorage.setItem(statsLocalStorageKey, JSON.stringify([data, ...previousData]));
  });

// Show data trigger

let tapCount = 0;
let clickCount = 0;
let timeout;

const deleteStats = () => {
  localStorage.removeItem(statsLocalStorageKey)
  alert('Done');

  window.location.reload();
};

const closeStats = () => {
  window.location.reload();
};

const showStats = () => {
  document.body.querySelector('.wrapper').innerHTML = `
  <div class="dialog" style="overflow-y: scroll;">
    <button type="button" onclick="deleteStats()">Delete all</button>
    <button type="button" onclick="closeStats()">Close</button>
    <pre class="pre-element">
      <code>
        ${localStorage.getItem(statsLocalStorageKey)}
      </code>
    </pre>
  </div>
  `
};

const tapOrClickCount = 15;

const resetCounts = () => {
  tapCount = 0;
  clickCount = 0;

  clearTimeout(timeout);
};

const handleTap = () => {
  tapCount += 1;

  clearTimeout(timeout);

  if (tapCount === tapOrClickCount) {
    showStats();
    resetCounts();
    return;
  }

  timeout = setTimeout(resetCounts, 1000);
};

const handleClick = () => {
  clickCount += 1;

  clearTimeout(timeout);

  if (clickCount === tapOrClickCount) {
    showStats();
    resetCounts();
    return;
  }

  timeout = setTimeout(resetCounts, 1000);
};

document.addEventListener('click', handleClick);
document.addEventListener('touchstart', handleTap);
