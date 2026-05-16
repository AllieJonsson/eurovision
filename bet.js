let currentDragId = null;
let startY = 0;
let currentMoveY = 0;
let blueprint = null;
let myOrder = [];
let startIndex = 0;
let currentInterval = undefined;
const createdBetEntries = [];

const isSubmissionLocked = new Date() > new Date('2026-05-16T22:00:00Z');
const getItem = () => {
  let accum = 16;
  let index = 0;
  for (; index < myOrder.length - 1; index++) {
    const countryElem = document.getElementById(myOrder[index].country);
    accum += countryElem.clientHeight + 9;
    if (accum >= currentMoveY + countryElem.clientHeight / 2) break;
  }
  const item = document.getElementById(
    myOrder.filter((m) => m.country !== currentDragId)[Math.min(index, myOrder.length - 2)].country,
  );
  return [index, item];
};
const followMouse = (e) => {
  if (currentDragId === null) return;
  currentMoveY = e.pageY - startY;
  const currentDrag = document.getElementById(currentDragId);
  currentDrag.style.top = `${currentMoveY}px`;
  currentDrag.classList.add('cursor-grabbing');
  const listItem = document.getElementById('list');
  const [index, item] = getItem();
  const elem = myOrder.find((m) => m.country === currentDragId);
  const prevIndex = myOrder.indexOf(elem);
  myOrder.splice(prevIndex, 1);
  myOrder = index >= myOrder.length ? [...myOrder, elem] : [...myOrder.slice(0, index), elem, ...myOrder.slice(index)];

  let accum = 16;
  for (let i = 0; i < myOrder.length; i++) {
    const countryElem = document.getElementById(myOrder[i].country);
    if (countryElem.id !== currentDrag.id) {
      countryElem.style.top = `${accum}px`;
    }
    accum += countryElem.clientHeight + 9;
    countryElem.firstElementChild.firstElementChild.firstElementChild.textContent = i + 1;
  }
  if (e.y <= 30) {
    clearInterval(currentInterval);
    currentInterval = setInterval(() => {
      document.documentElement.scrollTop -= 2;
    }, 1);
  } else {
    clearInterval(currentInterval);
    if (e.y >= window.innerHeight - 30) {
      currentInterval = setInterval(() => {
        document.documentElement.scrollTop += 2;
        if (
          document.documentElement.scrollTop >
          document.documentElement.offsetHeight - document.documentElement.clientHeight * 0.9
        ) {
          document.documentElement.scrollTop =
            document.documentElement.offsetHeight - document.documentElement.clientHeight * 0.9;
        }
      }, 1);
    }
  }
  // item.style.top = `${(index >= listItem.childElementCount - 1 ? index : index + 1) * 58}px`;
  // item.insertAdjacentElement(index >= listItem.childElementCount - 1 ? 'afterend' : 'beforebegin', blueprint);
};
const createEntry = (entry, index) => {
  if (!entry) return;
  const clone = blueprint.cloneNode(true);
  createdBetEntries.push(clone);
  clone.firstChild.parentElement.firstElementChild.firstElementChild.firstElementChild.textContent = index + 1;
  clone.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
    .style.backgroundImage = `url("https://flagcdn.com/h60/${entry.code}.png")`;
  
  clone.firstChild.parentElement.lastElementChild.previousElementSibling.previousElementSibling.firstElementChild.textContent =
    entry.artist;
  clone.firstChild.parentElement.lastElementChild.previousElementSibling.previousElementSibling.firstElementChild.nextElementSibling.textContent =
    entry.song;
  if (entry.youtube) {
    clone.firstChild.parentElement.lastElementChild.previousElementSibling.setAttribute('href', entry.youtube);
  }
  clone.id = entry.country;
  clone.classList.remove('hidden');
  const node = document.getElementById('list').appendChild(clone);
  if (isSubmissionLocked) return;
  clone.firstChild.parentElement.lastElementChild.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    currentDragId = e.currentTarget.parentElement.id;
    startY = e.touches[0].pageY - e.currentTarget.parentElement.offsetTop;
    blueprint.classList.remove('hidden');
    blueprint.classList.add('invisible');
    e.currentTarget.parentElement.classList.remove('duration-100');
    e.currentTarget.parentElement.classList.add('z-50');
    startIndex =
      Number(e.currentTarget.parentElement.firstElementChild.firstElementChild.firstElementChild.textContent) - 1;
    followMouse(e.touches[0]);
  });
  node.addEventListener('mousedown', (e) => {
    e.preventDefault();
    currentDragId = e.currentTarget.id;
    startY = e.pageY - e.currentTarget.offsetTop;
    blueprint.classList.remove('hidden');
    blueprint.classList.add('invisible');
    e.currentTarget.classList.remove('duration-100');
    e.currentTarget.classList.add('z-50');
    startIndex = Number(e.currentTarget.firstElementChild.firstElementChild.firstElementChild.textContent) - 1;

    followMouse(e);
  });
};
const updatePositionOfElements = () => {
  let accum = 16;
  for (let i = 0; i < myOrder.length; i++) {
    const countryElem = document.getElementById(myOrder[i].country);
    countryElem.style.top = `${accum}px`;
    countryElem.firstElementChild.firstElementChild.firstElementChild.textContent = i + 1;
    accum += countryElem.clientHeight + 9;
  }
};
const createEntries = (entriesToCreate) => {
  myOrder = structuredClone(entriesToCreate);
  blueprint = document.getElementById('blueprint');
  const observer = new MutationObserver(function (mutations) {
    const main = document.getElementById('main');
    for (let i = entriesToCreate.length - 1; i >= 0; i--) {
      const elem = document.getElementById(entriesToCreate[i].country);
      const rect = elem.getBoundingClientRect();
      elem.style.top = `${elem.offsetTop}px`;
      elem.classList.add('absolute');
    }
    main.style.height = `${main.clientHeight}px`;
    observer.disconnect();
  });
  observer.observe(document.getElementById('list'), {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  });
  entriesToCreate.map(createEntry);
  setTimeout(() => updatePositionOfElements(), 1);
  if (isSubmissionLocked) {
    document.getElementById('submissionLocked').classList.remove('hidden');
    return;
  }
  window.addEventListener('pointermove', followMouse);
  window.addEventListener('pointerup', (e) => {
    clearInterval(currentInterval);
    if (currentDragId === null) return;
    e.preventDefault();
    blueprint.classList.add('hidden');
    blueprint.classList.remove('invisible');
    const drag = document.getElementById(currentDragId);
    drag.classList.remove('z-50');
    drag.classList.add('duration-100');
    drag.classList.remove('cursor-grabbing');
    const listItem = document.getElementById('list');
    const [index, item] = getItem();
    const elem = myOrder.find((m) => m.country === currentDragId);
    const prevIndex = myOrder.indexOf(elem);
    myOrder.splice(prevIndex, 1);
    myOrder =
      index >= myOrder.length ? [...myOrder, elem] : [...myOrder.slice(0, index), elem, ...myOrder.slice(index)];

    let accum = 16;
    for (let i = 0; i < index; i++) {
      const countryElem = document.getElementById(myOrder[i].country);
      countryElem.style.top = `${accum}px`;
      countryElem.firstElementChild.firstElementChild.firstElementChild.textContent = i + 1;
      accum += countryElem.clientHeight + 9;
    }
    drag.style.top = `${accum}px`;
    drag.firstElementChild.firstElementChild.firstElementChild.textContent = index + 1;
    if (!location.href.startsWith('file:///')) {
      const id = localStorage.getItem('id');
      if (!id) {
        document.getElementById('tokenGone').classList.remove('hidden');
        document.getElementById('main').classList.add('hidden');
        return;
      }
      fetch('/api/bet', {
        method: 'POST',
        body: JSON.stringify({ id, bet: myOrder.map((m) => m.id) }),
      });
      createdEntries.forEach((e) => {
        e.remove();
      });
      createdEntries.length = 0;
    }
    currentDragId = null;
  });
  window.addEventListener('resize', (event) => {
    updatePositionOfElements();
  });
};

const hideBet = () => {
  document.getElementById('main').classList.add('hidden');
  document.getElementById('tutorial').classList.add('hidden');
};

const showBet = () => {
  const id = new URL(location.href).searchParams.get('id') ?? localStorage.getItem('id');
  if (!id) {
    document.getElementById('tokenGone').classList.remove('hidden');
    document.getElementById('spinner').classList.add('hidden');
  } else {
    localStorage.setItem('id', id);
    if (location.href.startsWith('file:///')) {
      if (createdBetEntries.length === 0) {
        createEntries(entries.filter((e) => e.active));
      }
      document.getElementById('main').classList.remove('hidden');
      document.getElementById('username').classList.remove('hidden');
      document.getElementById('tutorial').classList.remove('hidden');
      document.getElementById('spinner').classList.add('hidden');
    } else {
      if (createdBetEntries.length === 0) {
        fetch('/api/bet?id=' + id)
          .then((r) => r.json())
          .then((data) => {
            document.getElementById('main').classList.remove('hidden');
            document.getElementById('username').classList.remove('hidden');
            document.getElementById('tutorial').classList.remove('hidden');
            document.getElementById('username').textContent = `Hej ${data.user}!`;
            if (data.bet.length === 0) {
              createEntries(entries.filter((e) => e.active));
              fetch('/api/bet', {
                method: 'POST',
                body: JSON.stringify({ id, bet: entries.filter((e) => e.active).map((m) => m.id) }),
              });
            } else {
              const filtered = data.bet.map((id) => entries.find((e) => e.id === id && e.active)).filter(Boolean);
              if (filtered.length != data.bet.length) {
                fetch('/api/bet', {
                  method: 'POST',
                  body: JSON.stringify({ id, bet: filtered.map((m) => m.id) }),
                });
              }
              createEntries(filtered);
            }
          })
          .catch(console.error)
          .finally(() => {
            document.getElementById('spinner').classList.add('hidden');
          });
      } else {
        document.getElementById('main').classList.remove('hidden');
        document.getElementById('username').classList.remove('hidden');
        document.getElementById('tutorial').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
      }
    }
    updatePositionOfElements();
  }
};
