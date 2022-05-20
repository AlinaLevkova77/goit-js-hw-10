import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo:document.querySelector('.country-info'),
}
refs.input.addEventListener('input', debounce(onInputSearch,DEBOUNCE_DELAY));

function clearData() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

function onInputSearch(e) {
    const inputValue = e.target.value.trim();

    if (inputValue === "") {
        clearData();
        return;
    }


    fetchCountries(inputValue)
        .then(countries => {
            if (countries.length > 10) {
                clearData();
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            } else if (countries.length === 1) {
                clearData();
                renderCountry(countries[0]);
                return;
            }
            renderCountries(countries);
       
        })
        .catch(error => {
            clearData();
            Notiflix.Notify.failure('"Oops, there is no country with that name"');
            console.log(error);
            return;
        });

    function renderCountry(country) {
        console.log(country);
        const markup = `
    <div class = 'country'>
    <img src = '${country.flags.svg}' alt ='${country.name.official} class = 'flag'/>
    <h1>${country.name.official}</h1>
    <p><span>Capital:</span>${country.capital}</p>
    <p><span>Population:</span>${country.population}</p>
    <p><span>Languages:</span>${Object.values(country.languages)}</p>
    </div>`;
        refs.countryInfo.innerHTML = markup;
    }

    function renderCountries(countries) {
        clearData();
        const countriesMarcup = countries.map((country) => {
            return `
        <li>
        <img src = '${country.flags.svg}' alt ='${country.name.official}'/>
        <span>${country.name.official}</span>
        </li>`
        
        }).join('');
        refs.countryList.innerHTML = countriesMarcup;
    }
}
    


   
    





