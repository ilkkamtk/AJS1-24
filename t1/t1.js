'use strict';
import {restaurantModal, restaurantRow} from './components.js';
import {fetchData} from './fetchData.js';
import {apiURL} from './variables.js';

const kohde = document.querySelector('tbody');
const modaali = document.querySelector('dialog');
const info = document.querySelector('#info');
const closeModal = document.querySelector('#close-modal');

closeModal.addEventListener('click', () => {
  modaali.close();
});

const teeRavintolaLista = async () => {
  const restaurants = await fetchData(apiURL + '/api/v1/restaurants');

  restaurants.sort((a, b) => a.name.localeCompare(b.name));

  for (const restaurant of restaurants) {
    if (restaurant) {
      const {_id} = restaurant;

      // ravintolan HTML rivi
      const rivi = restaurantRow(restaurant);

      rivi.addEventListener('click', async () => {
        modaali.showModal();
        info.innerHTML = '<div>Ladataa...</div>';

        const korostetut = document.querySelectorAll('.highlight');
        for (const korostettu of korostetut) {
          korostettu.classList.remove('highlight');
        }

        rivi.classList.add('highlight');

        // hae päivän ruokalista
        const paivanLista = await fetchData(
          apiURL + `/api/v1/restaurants/daily/${_id}/fi`
        );

        console.log('päivan lista', paivanLista.courses);
        // tulosta päivän ruokalista
        const ravintolaHTML = restaurantModal(restaurant, paivanLista.courses);
        info.innerHTML = '';
        info.insertAdjacentHTML('beforeend', ravintolaHTML);
      });

      kohde.append(rivi);
    }
  }
};

teeRavintolaLista();
