document.addEventListener('DOMContentLoaded', loadCategories);

let selectedCategory = null;

let drawData = (data) => {
  const parent = document.querySelector('.contenedor-categorias ul');
  parent.innerHTML = '';

  data.forEach(category => {
    console.log(`categoría (${category.id}): ${category.name}`)
    let child = document.createElement('li');
    child.textContent = `${category.name} (${category.id})`;
    
    child.setAttribute('data-category-id', category.id);

    child.addEventListener('click', () => {
      if (selectedCategory) {
        selectedCategory.classList.remove('selected');
      }

      child.classList.add('selected');
      selectedCategory = child;

      fetch(`http://localhost:3000/categories/${category.id}`)
        .then(res => res.json())
        .then(data => drawSites(data))
    });

    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Eliminar';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteCategory(category.id));

    child.appendChild(deleteButton);
    parent.appendChild(child);
  });
}


let drawSites = (data) => {
  const parent = document.getElementById('sitesInformation')
  parent.innerHTML = '';
  parent.innerHTML = '<h2>Tus sitios web</h2>';

  let table = document.createElement('table');
  table.classList.add('table');

  let headerRow = table.insertRow(0);
  let headers = ['ID', 'Nombre', 'URL', 'Usuario', 'Contraseña'];

  headers.forEach(headerText => {
    let header = document.createElement('th');
    header.innerText = headerText;
    headerRow.appendChild(header);
  });

  data.sites.forEach(site => {
    let row = table.insertRow(-1);

    let idCell = row.insertCell(0);
    idCell.innerText = site.id;

    let nameCell = row.insertCell(1);
    nameCell.innerText = site.name;

    let urlCell = row.insertCell(2);
    urlCell.innerText = site.url;

    let userCell = row.insertCell(3);
    userCell.innerText = site.user;

    let passwordCell = row.insertCell(4);
    passwordCell.innerText = site.password;

    let deleteCell = row.insertCell(5);
    let deleteSiteButton = document.createElement('button');
    deleteSiteButton.innerText = 'Eliminar sitio';
    deleteSiteButton.classList.add('delete-button');
    deleteSiteButton.addEventListener('click', () => deleteSite(site.id, site.categoryId));
    deleteCell.appendChild(deleteSiteButton);

    let editCell = row.insertCell(6);
    let editSiteButton = document.createElement('button');
    editSiteButton.innerText = 'Editar sitio';
    editSiteButton.classList.add('delete-button');
    editSiteButton.addEventListener('click', () => redirectToEditSite(site.id, site.categoryId));
    editCell.appendChild(editSiteButton);
  });

  parent.appendChild(table);
}



function deleteCategory(categoryId) {
  fetch(`http://localhost:3000/categories/${categoryId}`, {
    method: 'DELETE'
  })
  .then(response => {
    console.log('Category deleted successfully');
    fetch("http://localhost:3000/categories")
      .then(res => res.json())
      .then(data => drawData(data))
  })
  .catch(error => {
    console.error('Error deleting category:', error);
  });
}


function deleteSite(siteId, categoryId) {
  fetch(`http://localhost:3000/sites/${siteId}`, {
    method: 'DELETE'
  })
  .then(response => {
    console.log('Site deleted successfully');
    
    fetch(`http://localhost:3000/categories/${categoryId}`)
      .then(res => res.json())
      .then(data => drawSites(data))
      .catch(error => {
        console.error('Error fetching category:', error);
      });
  })
  .catch(error => {
    console.error('Error deleting site:', error);
  });
}


function addNewCategory() {
  const newCategoryInput = document.getElementById('newCategoryInput');
  const categoryName = newCategoryInput.value.trim();

  if (categoryName !== '') {
    fetch('http://localhost:3000/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: categoryName })
    })
    .then(response => {
      console.log('Category added successfully');
      loadCategories();
      newCategoryInput.value = '';
      fetch("http://localhost:3000/categories")
        .then(res => res.json())
        .then(data => drawData(data))
    })
    .catch(error => {
      console.error('Error adding category:', error);
    });
  } else {
    alert('Por favor, añade un nombre a la categoría');
  }
}


function loadCategories() {
  const categoryList = document.getElementById('categoryList');

  fetch('http://localhost:3000/categories')
    .then(res => res.json())
    .then(data => {
      categoryList.innerHTML = '';

      data.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = `${category.name} (${category.id})`;

        categoryList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });
}

function redirectToSiteSection() {
  const selectedCategoryElement = document.querySelector('.contenedor-categorias li.selected');

  if (selectedCategoryElement) {
    const selectedCategoryId = selectedCategoryElement.getAttribute('data-category-id');
    sessionStorage.setItem('selectedCategoryId', selectedCategoryId);
    window.location.href = './site-section.html';
  } else {
    alert('Por favor, selecciona una categoría antes de ir a la sección de sitios.');
  }
}

function redirectToEditSite(siteId, categoryId) {
  const selectedCategoryElement = document.querySelector('.contenedor-categorias li.selected');
  const selectedCategoryId = selectedCategoryElement.getAttribute('data-category-id');
  sessionStorage.setItem('selectedCategoryId', selectedCategoryId);
  sessionStorage.setItem('selectedSiteId', siteId);

  window.location.href = './site-section.html';
}


fetch("http://localhost:3000/categories")
  .then(res => res.json())
  .then(data => drawData(data))
  .catch(error => {
    console.error('Error fetching categories:', error);
  });