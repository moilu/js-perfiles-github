const APIURL = 'https://api.github.com/users/';
const search = document.getElementById('search');
const form   = document.getElementById('form');
const main   = document.getElementById('main');


async function getUser( username ) {
    try {
        const { data }  = await axios(APIURL + username);

        createUserCard(data);
        getRepos(username);

    } catch(err) {

        if(err.response.status == 404) {

            createErrorCard('No hay un perfil con ese nombre de usuario.');
        }
    }
};

async function getRepos(username) {
    try {
        const { data }  = await axios(APIURL + username + '/repos?sort=created');

        addReposToCard(data);

    } catch(err) {
            createErrorCard('Hubo un problema consiguiendo los repositorios.');
            console.log(err)
    }
};

function createUserCard (user) {
    const cardHTML = `<div class="card">
    <div>
        <img src="${ user.avatar_url }" alt="" class="avatar">
    </div>
    <div class="user-info">
        <h2>${ user.login }</h2>
        <p>${ user.bio }</p>
        <ul>
            <li>${ user.followers }<strong>Seguidores</strong></li>
            <li>${ user.following }<strong>Siguiendo</strong></li>
            <li>${ user.public_repos }<strong>Repositorios</strong></li>
        </ul>
        <div class="repos" id="repos">
        </div>
    </div>
</div>`;

    main.innerHTML = cardHTML;

};

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');

    repos
        .slice(0, 10)
        .forEach(repo => {
            const repoEl  = document.createElement('a');
            repoEl.classList.add('repo');
            repoEl.href     = repo.html_url;
            repoEl.target = '_blank';
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        });

};

function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${ msg }</h1>
        </div>
    `;

    main.innerHTML = cardHTML;
}

form.addEventListener('submit', (e) => { 
    e.preventDefault();

    const user = search.value;

    if(user) {
        getUser( user );

        search.value = '';
    }
});