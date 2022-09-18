import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from '../src/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  textInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
};

refs.textInput.addEventListener('input', debounce(getCountry, DEBOUNCE_DELAY));

function getCountry(e) {
  const inputValue = e.target.value.trim();

  if (!inputValue) {
    return;
  }

  fetchCountries(inputValue)
    .then(data => {
      if (data.length > 10) {
        refs.countryList.innerHTML = '';

        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2) {
        getCardList(data);
      } else {
        getCard(data);
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      return error;
    });
}

function getCard(data) {
  refs.countryList.innerHTML = '';

  refs.countryCard.innerHTML = `<div class="card">
    <div class="card__top">
        <img src="${data[0].flags.svg}" alt="${
    data[0].name.common
  }" class="card__img">
        <h1 class="card__title">${data[0].name.common}</h1>
    </div>
    <div class="card__bottom">
        <p class="card__description">Capital: <span class="card__text">${
          data[0].capital
        }</span></p>
        <p class="card__description">Population: <span class="card__text">${
          data[0].population
        }</span></p>
        <p class="card__description">Language: <span class="card__text">${Object.values(
          data[0].languages
        ).join(', ')}</span></p>
    </div>
    </div>`;
}

function getCardList(data) {
  refs.countryCard.innerHTML = '';

  refs.countryList.innerHTML = data
    .map(({ flags, name }) => {
      return `<li class ="country__item"><img src="${flags.svg}" alt="flag of ${name.official}" class = "country__img" width="50">${name.official}</li>`;
    })
    .join('');
}
