let placementBlueprint = null;
let answerBlueprint = null;
let areResultsIn = false;
const createdEntries = [];
const createResultEntry = (entry, result, users) => {
  const placementClone = placementBlueprint.cloneNode(true);
  createdEntries.push(placementClone);
  placementClone.id = 'placement' + result;
  placementClone.classList.remove('hidden');
  placementClone.firstElementChild.textContent = 'Placering ' + result;

  if (areResultsIn) {
    placementClone.firstElementChild.nextElementSibling.firstElementChild.classList.add(
      `bg-[url(https://flagcdn.com/h60/${entry.code}.png)]`,
    );
    placementClone.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.textContent =
      entry.country;
  } else {
    placementClone.firstElementChild.nextElementSibling.firstElementChild.classList.add('bg-white');
    placementClone.firstElementChild.nextElementSibling.firstElementChild.classList.remove('shadow-md');
    placementClone.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.textContent = '';
  }
  document.getElementById('bets').appendChild(placementClone);

  for (const user of users) {
    if (user.bets.length < result) {
      continue;
    }
    const bet = user.bets[result - 1];
    const answerClone = answerBlueprint.cloneNode(true);
    answerClone.id = user.name + '_' + result;
    answerClone.classList.remove('hidden');
    answerClone.firstElementChild.textContent = user.name;
    const country = entries.find((e) => e.id === bet.id);
    answerClone.firstElementChild.nextElementSibling.classList.add(
      `bg-[url(https://flagcdn.com/h60/${country?.code ?? 'un'}.png)]`,
    );
    answerClone.firstElementChild.nextElementSibling.nextElementSibling.textContent = country?.country ?? '???';
    if (areResultsIn) {
      const element =
        answerClone.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild;
      element.textContent = bet.points;
      if (bet.points == 12) {
        element.classList.add('bg-amber-300');
        element.classList.add('text-amber-700');
      } else if (bet.points == 10) {
        element.classList.add('bg-violet-300');
        element.classList.add('text-violet-700');
      } else if (bet.points == 8) {
        element.classList.add('bg-pink-300');
        element.classList.add('text-pink-700');
      } else {
        element.classList.add('bg-slate-100');
      }
    } else {
      answerClone.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.textContent =
        '';
    }

    placementClone.appendChild(answerClone);
  }
};
const createResultEntries = (entries, users) => {
  placementBlueprint = document.getElementById('placementBlueprint');
  answerBlueprint = document.getElementById('answerBlueprint');
  leaderboardEntryBlueprint = document.getElementById('leaderboardEntryBlueprint');
  if (areResultsIn) {
    document.getElementById('leaderboard').classList.remove('hidden');
    users.map((user, index) => {
      if (index < 3) {
        document.getElementById('leaderboard' + (index + 1)).firstElementChild.nextElementSibling.textContent =
          user.name;
        document.getElementById(
          'leaderboard' + (index + 1),
        ).firstElementChild.nextElementSibling.nextElementSibling.textContent = user.points;
      } else {
        const entryClone = leaderboardEntryBlueprint.cloneNode(true);
        entryClone.classList.remove('hidden');
        entryClone.firstElementChild.textContent = index + 1 + '. ' + user.name;
        entryClone.firstElementChild.nextElementSibling.textContent = user.points;
        document.getElementById('leaderboard').firstElementChild.nextElementSibling.appendChild(entryClone);
      }
    });
  }
  if (areResultsIn) {
    entries.map((e, index) => createResultEntry(e, index + 1, users));
  } else {
    for (let i = 1; i <= 26; i++) {
      createResultEntry(null, i, users);
    }
  }
};
const mean = (values) => {
  let sum = 0;
  for (const v of values) {
    sum += v;
  }
  return sum / values.length;
};
const hideResult = () => {
  document.getElementById('bets').classList.add('hidden');
  document.getElementById('leaderboard').classList.add('hidden');
};

const showResult = () => {
  if (location.href.startsWith('file:///')) {
    const users = [
      {
        name: 'Alice Jonsson',
        points: 16,
        bets: entries
          .map((e) => ({ id: e.id, points: Math.floor(Math.random() * 12) + 1 }))
          .sort(() => Math.random() * 2 - 1),
      },
      {
        name: 'Alice Jonsson 2',
        points: 12,
        bets: entries
          .map((e) => ({ id: e.id, points: Math.floor(Math.random() * 12) + 1 }))
          .sort(() => Math.random() * 2 - 1),
      },
      {
        name: 'Alice Jonsson 3',
        points: 7,
        bets: entries
          .map((e) => ({ id: e.id, points: Math.floor(Math.random() * 12) + 1 }))
          .sort(() => Math.random() * 2 - 1),
      },
      {
        name: 'Alice Jonsson 4',
        points: 5,
        bets: entries
          .map((e) => ({ id: e.id, points: Math.floor(Math.random() * 12) + 1 }))
          .sort(() => Math.random() * 2 - 1),
      },
      {
        name: 'Alice Jonsson 5',
        points: 2,
        bets: entries
          .map((e) => ({ id: e.id, points: Math.floor(Math.random() * 12) + 1 }))
          .sort(() => Math.random() * 2 - 1),
      },
    ];
    if (createdEntries.length === 0) {
      createResultEntries(
        entries.sort(
          (a, b) =>
            mean(users.map((u) => u.bets.findIndex((bet) => bet.id === a.id))) -
            mean(users.map((u) => u.bets.findIndex((bet) => bet.id === b.id))),
        ),
        users,
      );
    }
    document.getElementById('bets').classList.remove('hidden');
    document.getElementById('spinner').classList.add('hidden');
  } else {
    if (createdEntries.length === 0) {
      document.getElementById('spinner').classList.remove('hidden');
      fetch('/api/results')
        .then((r) => r.json())
        .then((data) => {
          document.getElementById('bets').classList.remove('hidden');
          if (data.entries.length > 0) areResultsIn = true;
          createResultEntries(
            data.entries.map((id) => entries.find((e) => e.id === id)),
            data.users,
          );
        })
        .catch(console.error)
        .finally(() => {
          document.getElementById('spinner').classList.add('hidden');
        });
    } else {
      document.getElementById('bets').classList.remove('hidden');
      document.getElementById('spinner').classList.add('hidden');
    }
  }
};
